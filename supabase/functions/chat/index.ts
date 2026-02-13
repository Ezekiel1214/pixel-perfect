import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

type RateLimitState = {
  count: number;
  windowStart: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const MAX_MESSAGE_COUNT = 40;
const MAX_PROMPT_CHARS = 20_000;

const userRateLimitStore = new Map<string, RateLimitState>();

const parseHttpOrigin = (origin: string): string | null => {
  const trimmedOrigin = origin.trim().replace(/\/+$/, "");

  if (!trimmedOrigin) {
    return null;
  }

  try {
    const parsed = new URL(trimmedOrigin);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.origin;
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    const payload = JSON.parse(json);

    return payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

const getUserIdFromAuthHeader = (authorizationHeader: string | null): string | null => {
  if (!authorizationHeader) return null;

  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const payload = decodeJwtPayload(match[1]);
  const sub = payload?.sub;

  return typeof sub === "string" && sub.length > 0 ? sub : null;
};

const isRateLimited = (userId: string) => {
  const now = Date.now();
  const existing = userRateLimitStore.get(userId);

  if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
    userRateLimitStore.set(userId, { count: 1, windowStart: now });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  userRateLimitStore.set(userId, existing);
  return false;
};

const computePromptCharCount = (messages: unknown[]): number => {
  return messages.reduce<number>((total, message) => {
    if (!message || typeof message !== "object") return total;

    const content = (message as { content?: unknown }).content;
    if (typeof content !== "string") return total;

    return total + content.length;
  }, 0);
};

const configuredAllowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowMissingOrigin = (Deno.env.get("ALLOW_MISSING_ORIGIN") ?? "").toLowerCase() === "true";
const wildcardConfigured = configuredAllowedOrigins.includes("*");
const concreteConfiguredOrigins = configuredAllowedOrigins.filter((origin) => origin !== "*");
const allowedOrigins = Array.from(
  new Set(
    concreteConfiguredOrigins
      .map((origin) => parseHttpOrigin(origin))
      .filter((origin): origin is string => Boolean(origin)),
  ),
);
const invalidConfiguredOrigins = concreteConfiguredOrigins.filter((origin) => !parseHttpOrigin(origin));

if (wildcardConfigured) {
  console.warn("Ignoring wildcard ALLOWED_ORIGINS entry; explicit origins are required.");
}

if (invalidConfiguredOrigins.length > 0) {
  console.warn("Ignoring invalid ALLOWED_ORIGINS entries:", invalidConfiguredOrigins.join(", "));
}

const isOriginAllowed = (origin: string) => {
  const parsedOrigin = parseHttpOrigin(origin);
  if (!parsedOrigin) {
    return false;
  }

  return allowedOrigins.includes(parsedOrigin);
};

const getCorsHeaders = (origin: string | null) => {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };

  const parsedOrigin = origin ? parseHttpOrigin(origin) : null;
  if (parsedOrigin && isOriginAllowed(parsedOrigin)) {
    headers["Access-Control-Allow-Origin"] = parsedOrigin;
  }

  return headers;
};

const jsonResponse = (corsHeaders: Record<string, string>, status: number, error: string) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (!origin) {
    if (!allowMissingOrigin) {
      return jsonResponse(corsHeaders, 403, "Origin header required");
    }
  } else {
    if (allowedOrigins.length === 0) {
      console.warn("ALLOWED_ORIGINS is not configured; rejecting browser-origin request", origin);
      return jsonResponse(corsHeaders, 403, "Origin not allowed. Configure ALLOWED_ORIGINS.");
    }

    if (!isOriginAllowed(origin)) {
      return jsonResponse(corsHeaders, 403, "Origin not allowed");
    }
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(corsHeaders, 405, "Method not allowed");
  }

  try {
    const { messages, projectName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse(corsHeaders, 400, "messages must be a non-empty array");
    }

    if (messages.length > MAX_MESSAGE_COUNT) {
      return jsonResponse(corsHeaders, 400, `Too many messages. Limit is ${MAX_MESSAGE_COUNT}.`);
    }

    const promptCharCount = computePromptCharCount(messages);
    if (promptCharCount > MAX_PROMPT_CHARS) {
      return jsonResponse(corsHeaders, 400, `Prompt too long. Limit is ${MAX_PROMPT_CHARS} characters.`);
    }

    const userId = getUserIdFromAuthHeader(req.headers.get("authorization"));
    if (!userId) {
      return jsonResponse(corsHeaders, 401, "Unauthorized");
    }

    if (isRateLimited(userId)) {
      return jsonResponse(corsHeaders, 429, "Rate limit exceeded. Please try again later.");
    }

    console.log("Processing chat request for project:", projectName);
    console.log("Messages count:", messages.length);

    const systemPrompt = `You are an expert web developer AI assistant for "${projectName || "a website"}". Your job is to help users build beautiful, modern websites.

When the user describes what they want, generate clean, semantic HTML with Tailwind CSS classes. 

Guidelines:
- Use modern Tailwind CSS classes for styling
- Create responsive designs (mobile-first)
- Use semantic HTML elements (header, main, section, article, footer, nav)
- Include appropriate spacing, colors, and typography
- Make it visually appealing with gradients, shadows, and modern design patterns
- When generating full pages, include proper structure with doctype, head, and body
- For components, just return the HTML snippet

Always respond with the HTML code wrapped in \`\`\`html code blocks. You can also provide brief explanations before or after the code.

If the user asks questions or wants modifications, update the code accordingly and provide the complete updated version.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return jsonResponse(corsHeaders, 429, "Rate limit exceeded. Please try again later.");
      }
      if (response.status === 402) {
        return jsonResponse(corsHeaders, 402, "Payment required. Please add credits to continue.");
      }

      return jsonResponse(corsHeaders, 500, "AI service error");
    }

    console.log("Streaming response back to client");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return jsonResponse(corsHeaders, 500, error instanceof Error ? error.message : "Unknown error");
  }
});
