import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function useProjectEditor(projectId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectOwnerId, setProjectOwnerId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("name, content, messages, user_id")
        .eq("id", projectId)
        .maybeSingle();

      if (error) {
        console.error("Error loading project:", error);
        toast({
          variant: "destructive",
          title: "Failed to load project",
          description: error.message,
        });
        return;
      }

      if (data) {
        setProjectName(data.name);
        setProjectOwnerId(data.user_id);
        setContent(data.content || "");
        setMessages((data.messages as unknown as ChatMessage[]) || []);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, toast]);

  // Save project content
  const saveProject = useCallback(async (newContent: string, newMessages: ChatMessage[]) => {
    setIsSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({ 
        content: newContent, 
        messages: newMessages as unknown as null,
        updated_at: new Date().toISOString()
      })
      .eq("id", projectId);

    setIsSaving(false);
    
    if (error) {
      console.error("Error saving project:", error);
    }
  }, [projectId]);

  // Extract HTML from AI response
  const extractHtmlFromResponse = (text: string): string | null => {
    const fencedHtmlMatch = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
    if (fencedHtmlMatch?.[1]) {
      return fencedHtmlMatch[1].trim();
    }

    const directHtmlStart = text.search(/<!doctype html|<html|<main|<section|<div|<header/i);
    if (directHtmlStart !== -1) {
      return text.slice(directHtmlStart).trim();
    }

    return null;
  };

  // Send message to AI
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: "user", content: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    let assistantContent = "";

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("You must be signed in to use AI chat.");
      }

      const hostname = window.location.hostname;
      const isLocalHost = ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname);
      const isPrivateIpv4 = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
      const shouldUseProxy = import.meta.env.DEV || isLocalHost || isPrivateIpv4;

      const chatFunctionUrl = shouldUseProxy
        ? "/functions/v1/chat"
        : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

      const response = await fetch(chatFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: updatedMessages,
          projectName,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to get AI response (${response.status})`;
        const contentType = response.headers.get("content-type") || "";
        const errorText = await response.text();

        if (contentType.includes("application/json") && errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            errorMessage = errorText;
          }
        } else if (errorText) {
          errorMessage = errorText;
        }

        if (response.status === 401) {
          errorMessage = "Your session expired. Please sign in again.";
        }

        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages([...updatedMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch {
            // Incomplete JSON, wait for more data
          }
        }
      }

      // Extract HTML and update content
      const extractedHtml = extractHtmlFromResponse(assistantContent);
      if (extractedHtml) {
        setContent(extractedHtml);
      }

      // Save to database
      const finalMessages = [...updatedMessages, { role: "assistant" as const, content: assistantContent }];
      setMessages(finalMessages);
      await saveProject(extractedHtml || content, finalMessages);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
      });
      // Remove the user message on error
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, projectName, content, saveProject, toast]);

  return {
    messages,
    content,
    isLoading,
    isSaving,
    projectName,
    projectOwnerId,
    sendMessage,
    setContent,
  };
}
