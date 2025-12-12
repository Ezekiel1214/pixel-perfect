import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function PublicProject() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        setError("Project not found");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("content, name, is_public")
        .eq("slug", slug)
        .eq("is_public", true)
        .maybeSingle();

      if (fetchError) {
        setError("Failed to load project");
      } else if (!data) {
        setError("Project not found or not public");
      } else {
        setContent(data.content);
      }
      setLoading(false);
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <h1 className="text-2xl font-bold mb-2">404</h1>
        <p className="text-gray-400">{error || "Project not found"}</p>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={content}
      title="Published Project"
      className="w-full h-screen border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
