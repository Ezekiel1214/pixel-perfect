import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: "draft" | "published" | "archived";
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!user,
  });

  const createProject = useMutation({
    mutationFn: async (project: { name: string; description?: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: project.name,
          description: project.description || null,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project created",
        description: "Your new project is ready to build!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create project",
        description: error.message,
      });
    },
  });


  const duplicateProject = useMutation({
    mutationFn: async (project: Project) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: `${project.name} (Copy)`,
          description: project.description,
          status: "draft",
          thumbnail_url: project.thumbnail_url,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project duplicated",
        description: "A copy of the project has been created.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to duplicate project",
        description: error.message,
      });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been removed.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete project",
        description: error.message,
      });
    },
  });

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    createProject,
    duplicateProject,
    deleteProject,
  };
}
