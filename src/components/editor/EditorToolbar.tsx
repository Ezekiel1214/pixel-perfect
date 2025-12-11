import { Code, Eye, Undo2, Redo2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorToolbarProps {
  viewMode: "preview" | "code" | "split";
  onViewModeChange: (mode: "preview" | "code" | "split") => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format: "html" | "zip") => void;
  hasContent: boolean;
}

export function EditorToolbar({
  viewMode,
  onViewModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
  hasContent,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      {/* View Mode Toggle */}
      <div className="flex gap-1 border border-border rounded-md p-0.5">
        <Button
          variant={viewMode === "preview" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("preview")}
          className="h-7 px-2"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          Preview
        </Button>
        <Button
          variant={viewMode === "code" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("code")}
          className="h-7 px-2"
        >
          <Code className="h-3.5 w-3.5 mr-1" />
          Code
        </Button>
        <Button
          variant={viewMode === "split" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("split")}
          className="h-7 px-2"
        >
          Split
        </Button>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="h-8 w-8"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="h-8 w-8"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Export */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={!hasContent}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onExport("html")}>
            Export as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport("zip")}>
            Export as ZIP
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
