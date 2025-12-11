import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatInterface } from "@/components/editor/ChatInterface";
import { LivePreview } from "@/components/editor/LivePreview";
import { CodeView } from "@/components/editor/CodeView";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { useProjectEditor } from "@/hooks/useProjectEditor";
import { useContentHistory } from "@/hooks/useContentHistory";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { downloadAsHtml, downloadAsZip } from "@/lib/exportProject";
import { useToast } from "@/hooks/use-toast";

type ViewMode = "preview" | "code" | "split";

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { messages, content, isLoading, isSaving, projectName, sendMessage, setContent } = useProjectEditor(id || "");
  const { content: historyContent, setContent: setHistoryContent, undo, redo, canUndo, canRedo, resetHistory } = useContentHistory();
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
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
        <div className="flex items-center gap-4">
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
          
          <ResizablePanel defaultSize={65}>
            {renderPreviewPanel()}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
