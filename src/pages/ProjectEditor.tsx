import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save, PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatInterface } from "@/components/editor/ChatInterface";
import { LivePreview } from "@/components/editor/LivePreview";
import { CodeView } from "@/components/editor/CodeView";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { AssetsSidebar } from "@/components/editor/AssetsSidebar";
import { useProjectEditor } from "@/hooks/useProjectEditor";
import { useContentHistory } from "@/hooks/useContentHistory";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { downloadAsHtml, downloadAsZip } from "@/lib/exportProject";
import { useToast } from "@/hooks/use-toast";
import { Template } from "@/data/templates";
import { ComponentItem } from "@/data/components";

type ViewMode = "preview" | "code" | "split";

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { messages, content, isLoading, isSaving, projectName, sendMessage, setContent } = useProjectEditor(id || "");
  const { content: historyContent, setContent: setHistoryContent, undo, redo, canUndo, canRedo, resetHistory } = useContentHistory();
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [showAssets, setShowAssets] = useState(false);
  const { toast } = useToast();

  // Sync content from project editor to history
  useEffect(() => {
    if (content && content !== historyContent) {
      setHistoryContent(content);
    }
  }, [content]);

  // Sync history content back to project editor when undo/redo
  useEffect(() => {
    if (historyContent !== content) {
      setContent(historyContent);
    }
  }, [historyContent]);

  // Initialize history when project loads
  useEffect(() => {
    if (content) {
      resetHistory(content);
    }
  }, [projectName]); // Reset when project loads (projectName changes)

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const handleExport = useCallback((format: "html" | "zip") => {
    if (!content) return;
    
    try {
      if (format === "html") {
        downloadAsHtml(content, projectName || "project");
      } else {
        downloadAsZip(content, projectName || "project");
      }
      toast({
        title: "Export successful",
        description: `Project exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Could not export the project",
      });
    }
  }, [content, projectName, toast]);

  const handleSelectTemplate = useCallback((template: Template) => {
    setHistoryContent(template.html);
    setContent(template.html);
    toast({ title: "Template applied", description: `${template.name} template loaded` });
  }, [setHistoryContent, setContent, toast]);

  const handleInsertComponent = useCallback((component: ComponentItem) => {
    if (!content) {
      // If no content, wrap component in basic HTML structure
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900">
${component.html}
</body>
</html>`;
      setHistoryContent(html);
      setContent(html);
    } else {
      // Insert before </body>
      const newContent = content.replace("</body>", `${component.html}\n</body>`);
      setHistoryContent(newContent);
      setContent(newContent);
    }
    toast({ title: "Component added", description: `${component.name} inserted` });
  }, [content, setHistoryContent, setContent, toast]);

  const handleInsertImage = useCallback((url: string) => {
    const imgTag = `<img src="${url}" alt="Uploaded image" class="max-w-full h-auto" />`;
    navigator.clipboard.writeText(imgTag);
    toast({ title: "Image tag copied", description: "Paste it in your code or ask AI to use it" });
  }, [toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!id) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const renderPreviewPanel = () => {
    if (viewMode === "code") {
      return <CodeView content={content} />;
    }
    if (viewMode === "split") {
      return (
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <LivePreview content={content} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <CodeView content={content} />
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    }
    return <LivePreview content={content} />;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-foreground">{projectName || "Loading..."}</h1>
            <p className="text-xs text-muted-foreground">AI Web Builder</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showAssets ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAssets(!showAssets)}
          >
            {showAssets ? <PanelRightClose className="h-4 w-4 mr-2" /> : <PanelRightOpen className="h-4 w-4 mr-2" />}
            Assets
          </Button>
          <EditorToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onExport={handleExport}
            hasContent={!!content}
          />
          {isSaving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Save className="h-3 w-3" />
              Saving...
            </span>
          )}
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={showAssets ? 45 : 65}>
            {renderPreviewPanel()}
          </ResizablePanel>

          {showAssets && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <AssetsSidebar
                  onSelectTemplate={handleSelectTemplate}
                  onInsertComponent={handleInsertComponent}
                  onInsertImage={handleInsertImage}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
