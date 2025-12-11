import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface CodeViewProps {
  content: string;
}

export function CodeView({ content }: CodeViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="font-semibold text-foreground">Code</h2>
        <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!content}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {content ? (
          <pre className="p-4 text-sm text-foreground font-mono whitespace-pre-wrap break-words">
            <code>{content}</code>
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full p-4 text-muted-foreground">
            <p>No code generated yet</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
