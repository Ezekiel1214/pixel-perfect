import { useState, useEffect } from "react";
import { History, RotateCcw, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Version {
  id: string;
  version_number: number;
  content: string;
  description: string | null;
  created_at: string;
}

interface VersionHistoryDialogProps {
  projectId: string;
  currentContent: string;
  onRestore: (content: string) => void;
}

export function VersionHistoryDialog({ projectId, currentContent, onRestore }: VersionHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchVersions();
    }
  }, [open, projectId]);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("project_versions")
        .select("*")
        .eq("project_id", projectId)
        .order("version_number", { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error("Error fetching versions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load version history",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = (version: Version) => {
    onRestore(version.content);
    setOpen(false);
    toast({
      title: "Version restored",
      description: `Restored to version ${version.version_number}`,
    });
  };

  const saveCurrentVersion = async () => {
    if (!currentContent) return;
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const nextVersion = versions.length > 0 ? versions[0].version_number + 1 : 1;
      
      const { error } = await supabase.from("project_versions").insert({
        project_id: projectId,
        content: currentContent,
        version_number: nextVersion,
        created_by: user.user.id,
        description: `Manual save - Version ${nextVersion}`,
      });

      if (error) throw error;
      
      toast({
        title: "Version saved",
        description: `Saved as version ${nextVersion}`,
      });
      fetchVersions();
    } catch (error) {
      console.error("Error saving version:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save version",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            View and restore previous versions of your project
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button onClick={saveCurrentVersion} size="sm">
            Save Current Version
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No versions saved yet</p>
            <p className="text-sm">Save a version to start tracking changes</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors ${
                    selectedVersion?.id === version.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div>
                    <p className="font-medium text-foreground">
                      Version {version.version_number}
                    </p>
                    {version.description && (
                      <p className="text-sm text-muted-foreground">{version.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(version.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(version);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
