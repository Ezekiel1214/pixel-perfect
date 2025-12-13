import { useState, useEffect } from "react";
import { Code2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CustomCodeDialogProps {
  projectId: string;
}

export function CustomCodeDialog({ projectId }: CustomCodeDialogProps) {
  const [open, setOpen] = useState(false);
  const [customCss, setCustomCss] = useState("");
  const [customJs, setCustomJs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCustomCode();
    }
  }, [open, projectId]);

  const fetchCustomCode = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("custom_css, custom_js")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setCustomCss(data?.custom_css || "");
      setCustomJs(data?.custom_js || "");
    } catch (error) {
      console.error("Error fetching custom code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load custom code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          custom_css: customCss,
          custom_js: customJs,
        })
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Custom code saved",
        description: "Your CSS and JavaScript have been updated",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error saving custom code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save custom code",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Code2 className="h-4 w-4 mr-2" />
          Custom Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Custom CSS & JavaScript</DialogTitle>
          <DialogDescription>
            Add custom styles and scripts to your project
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="css" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="css" className="space-y-2">
              <Label htmlFor="custom-css">Custom CSS</Label>
              <Textarea
                id="custom-css"
                placeholder={`/* Add your custom styles here */
.my-class {
  color: #ff0000;
}`}
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                These styles will be injected into your published project
              </p>
            </TabsContent>
            <TabsContent value="js" className="space-y-2">
              <Label htmlFor="custom-js">Custom JavaScript</Label>
              <Textarea
                id="custom-js"
                placeholder={`// Add your custom JavaScript here
console.log('Hello from custom script!');`}
                value={customJs}
                onChange={(e) => setCustomJs(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This script will run after the page loads
              </p>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
