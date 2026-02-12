import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedImage {
  name: string;
  url: string;
  path: string;
}

interface ImageUploaderProps {
  onInsertImage: (url: string) => void;
}

export function ImageUploader({ onInsertImage }: ImageUploaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadImages = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("project-assets")
        .list(user.id, { limit: 100, sortBy: { column: "created_at", order: "desc" } });

      if (error) throw error;

      const imageFiles = (data || []).filter(
        (file) => file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
      );

      const urls = imageFiles.map((file) => {
        const { data: urlData } = supabase.storage
          .from("project-assets")
          .getPublicUrl(`${user.id}/${file.name}`);
        return {
          name: file.name,
          url: urlData.publicUrl,
          path: `${user.id}/${file.name}`,
        };
      });

      setImages(urls);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load images on mount
  useState(() => {
    loadImages();
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user.id}/${fileName}`;

        const { error } = await supabase.storage
          .from("project-assets")
          .upload(filePath, file);

        if (error) throw error;
      }

      toast({ title: "Upload successful", description: `${files.length} image(s) uploaded` });
      loadImages();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (path: string) => {
    try {
      const { error } = await supabase.storage.from("project-assets").remove([path]);
      if (error) throw error;
      
      setImages((prev) => prev.filter((img) => img.path !== path));
      toast({ title: "Image deleted" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button variant="outline" className="w-full" disabled={isUploading} asChild>
            <span>
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload Images
            </span>
          </Button>
        </label>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No images uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map((image) => (
                <div
                  key={image.path}
                  className="relative group rounded-lg overflow-hidden border border-border bg-muted"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onInsertImage(image.url)}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => copyUrl(image.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(image.path)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
