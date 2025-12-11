import { useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  content: string;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportSizes: Record<ViewportSize, string> = {
  desktop: "w-full",
  tablet: "w-[768px]",
  mobile: "w-[375px]",
};

export function LivePreview({ content }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");

  const fullHtml = content.includes("<!DOCTYPE") || content.includes("<html")
    ? content
    : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
${content}
</body>
</html>`;

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="flex items-center justify-between p-3 border-b border-border bg-background">
        <h2 className="font-semibold text-foreground">Preview</h2>
        <div className="flex gap-1">
          <Button
            variant={viewport === "desktop" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewport("desktop")}
            title="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewport === "tablet" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewport("tablet")}
            title="Tablet view"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewport === "mobile" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewport("mobile")}
            title="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex justify-center">
        {content ? (
          <div
            className={cn(
              "bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300 h-full",
              viewportSizes[viewport]
            )}
          >
            <iframe
              srcDoc={fullHtml}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Your website preview will appear here</p>
              <p className="text-sm mt-1">Start chatting with the AI to generate content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
