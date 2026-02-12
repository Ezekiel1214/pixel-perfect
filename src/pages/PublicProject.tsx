import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function PublicProject() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("Project");
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
        .select("id, content, name, is_public, custom_css, custom_js, description")
        .eq("slug", slug)
        .eq("is_public", true)
        .maybeSingle();

      if (fetchError) {
        setError("Failed to load project");
      } else if (!data) {
        setError("Project not found or not public");
      } else {
        setProjectName(data.name);
        
        // Inject custom CSS and JS into content
        let finalContent = data.content || "";
        
        if (data.custom_css) {
          finalContent = finalContent.replace(
            "</head>",
            `<style>${data.custom_css}</style>\n</head>`
          );
        }
        
        if (data.custom_js) {
          finalContent = finalContent.replace(
            "</body>",
            `<script>${data.custom_js}</script>\n</body>`
          );
        }
        
        setContent(finalContent);
        
        // Track analytics
        trackView(data.id);
      }
      setLoading(false);
    }

    fetchProject();
  }, [slug]);

  const trackView = async (projectId: string) => {
    try {
      await supabase.rpc("increment_project_view", { p_project_id: projectId });
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <>
        <Helmet>
          <title>Project Not Found - AIWebBuilder Pro</title>
        </Helmet>
        <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground">
          <h1 className="text-2xl font-bold mb-2">404</h1>
          <p className="text-muted-foreground">{error || "Project not found"}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{projectName} - Built with AIWebBuilder Pro</title>
        <meta name="description" content={`View ${projectName}, a project built with AIWebBuilder Pro`} />
      </Helmet>
      <iframe
        srcDoc={content}
        title={projectName}
        className="w-full h-screen border-0"
        sandbox="allow-scripts"
      />
    </>
  );
}
