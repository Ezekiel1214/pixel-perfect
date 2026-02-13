import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Globe, Clock, MoreVertical, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjects, Project } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";

export function ProjectsGrid() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, isLoading, createProject, duplicateProject, deleteProject } = useProjects();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setIsCreateDialogOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete("create");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    await createProject.mutateAsync({
      name: newProjectName.trim(),
      description: newProjectDescription.trim() || undefined,
    });
    
    setNewProjectName("");
    setNewProjectDescription("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject.mutateAsync(projectId);
  };

  const handleDuplicateProject = async (project: Project) => {
    await duplicateProject.mutateAsync(project);
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* New Project Card */}
        <Card 
          className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground font-medium">
              Create New Project
            </span>
          </CardContent>
        </Card>

        {/* Project Cards */}
        {projects.map((project: Project) => (
          <Card 
            key={project.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <div className="relative h-36 overflow-hidden bg-muted">
              {project.thumbnail_url ? (
                <img
                  src={project.thumbnail_url}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-4xl font-bold text-primary/30">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/project/${project.id}`)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateProject(project)}>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {project.status === "published" && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full">
                  <Globe className="w-3 h-3" />
                  Live
                </div>
              )}
            </div>
            <CardFooter className="flex flex-col items-start gap-1 p-4">
              <h3 className="font-semibold">{project.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDate(project.updated_at)}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Give your project a name and optional description to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="My Awesome Website"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description (optional)</Label>
              <Textarea
                id="project-description"
                placeholder="A brief description of your project..."
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject} 
              disabled={!newProjectName.trim() || createProject.isPending}
            >
              {createProject.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
