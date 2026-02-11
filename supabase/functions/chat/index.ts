import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

const configuredAllowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowAnyOrigin = configuredAllowedOrigins.includes("*");
const allowedOrigins = configuredAllowedOrigins
  .filter((origin) => origin !== "*")
  .map((origin) => parseHttpOrigin(origin))
  .filter((origin): origin is string => Boolean(origin));

const isOriginAllowed = (origin: string | null) => {
  if (!origin) return true;

  if (allowAnyOrigin) {
    return true;
  }

  const parsedOrigin = parseHttpOrigin(origin);
  if (!parsedOrigin) {
    return false;
  }

  return allowedOrigins.includes(parsedOrigin);
};

const getCorsHeaders = (origin: string | null) => {
  if (!origin) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };
  }

  const allowOrigin = isOriginAllowed(origin)
    ? (allowAnyOrigin ? "*" : parseHttpOrigin(origin) ?? "null")
    : "null";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
};

const jsonResponse = (corsHeaders: Record<string, string>, status: number, error: string) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (origin && !allowAnyOrigin && allowedOrigins.length === 0) {
    console.warn("ALLOWED_ORIGINS is not configured; rejecting browser-origin request", origin);
    return jsonResponse(corsHeaders, 403, "Origin not allowed. Configure ALLOWED_ORIGINS.");
  }

  if (origin && !isOriginAllowed(origin)) {
    return jsonResponse(corsHeaders, 403, "Origin not allowed");
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
