import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Globe, Code, ExternalLink, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const isStrongSlug = (value: string) =>
  value.length >= 3 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

export function PublishDialog({ open, onOpenChange, projectId, projectName }: PublishDialogProps) {
  const { toast } = useToast();
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const baseUrl = window.location.origin;
  const publicUrl = slug ? `${baseUrl}/p/${slug}` : "";
  const embedCode = slug ? `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>` : "";

  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) + "-" + Math.random().toString(36).slice(2, 8);
  }, []);

  const loadProjectSettings = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("slug, is_public")
      .eq("id", projectId)
      .single();

    if (!error && data) {
      setSlug(normalizeSlug(data.slug || generateSlug(projectName)));
      setIsPublic(data.is_public || false);
    } else {
      setSlug(normalizeSlug(generateSlug(projectName)));
    }
    setIsLoading(false);
  }, [projectId, projectName, generateSlug]);

  useEffect(() => {
    if (open) {
      loadProjectSettings();
    }
  }, [open, loadProjectSettings]);

  const handleSave = async () => {
    const normalizedSlug = normalizeSlug(slug);

    if (!isStrongSlug(normalizedSlug)) {
      toast({
        variant: "destructive",
        title: "Invalid slug",
        description: "Use at least 3 characters with letters, numbers, or single hyphens between words.",
      });
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        slug: normalizedSlug,
        is_public: isPublic,
        published_at: isPublic ? new Date().toISOString() : null,
      })
      .eq("id", projectId);

    if (error) {
      if (error.code === "23505") {
        toast({ variant: "destructive", title: "Slug already taken", description: "Please choose a different URL" });
      } else {
        toast({ variant: "destructive", title: "Failed to save", description: error.message });
      }
    } else {
      toast({ title: isPublic ? "Project published!" : "Settings saved" });
    }
    setIsSaving(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Publish & Share</DialogTitle>
          <DialogDescription>
            Make your project public and share it with others
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Make Public</Label>
                <p className="text-sm text-muted-foreground">
                  Anyone with the link can view
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            <div className="space-y-2">
              <Label>Custom URL Slug</Label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-1 bg-muted px-3 rounded-md">
                  <span className="text-muted-foreground text-sm">{baseUrl}/p/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(normalizeSlug(e.target.value))}
                    className="border-0 bg-transparent p-0 h-9 focus-visible:ring-0"
                    placeholder="my-project"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
              {isPublic ? "Publish" : "Save Settings"}
            </Button>

            {isPublic && slug && (
              <Tabs defaultValue="link" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="link">Share Link</TabsTrigger>
                  <TabsTrigger value="embed">Embed Code</TabsTrigger>
                </TabsList>
                <TabsContent value="link" className="space-y-3">
                  <div className="flex gap-2">
                    <Input value={publicUrl} readOnly className="flex-1" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(publicUrl, "Link")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="embed" className="space-y-3">
                  <div className="flex gap-2">
                    <Input value={embedCode} readOnly className="flex-1 text-xs" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(embedCode, "Embed code")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    Paste this code to embed your project
                  </p>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
