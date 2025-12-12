import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatesPanel } from "./TemplatesPanel";
import { ComponentsPanel } from "./ComponentsPanel";
import { ImageUploader } from "./ImageUploader";
import { Template } from "@/data/templates";
import { ComponentItem } from "@/data/components";
import { LayoutTemplate, Puzzle, Image } from "lucide-react";

interface AssetsSidebarProps {
  onSelectTemplate: (template: Template) => void;
  onInsertComponent: (component: ComponentItem) => void;
  onInsertImage: (url: string) => void;
}

export function AssetsSidebar({
  onSelectTemplate,
  onInsertComponent,
  onInsertImage,
}: AssetsSidebarProps) {
  return (
    <Tabs defaultValue="templates" className="h-full flex flex-col">
      <TabsList className="w-full justify-start rounded-none border-b border-border bg-background px-2 h-12">
        <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-muted">
          <LayoutTemplate className="h-4 w-4" />
          <span className="hidden sm:inline">Templates</span>
        </TabsTrigger>
        <TabsTrigger value="components" className="gap-2 data-[state=active]:bg-muted">
          <Puzzle className="h-4 w-4" />
          <span className="hidden sm:inline">Components</span>
        </TabsTrigger>
        <TabsTrigger value="images" className="gap-2 data-[state=active]:bg-muted">
          <Image className="h-4 w-4" />
          <span className="hidden sm:inline">Images</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="templates" className="flex-1 m-0 overflow-hidden">
        <TemplatesPanel onSelectTemplate={onSelectTemplate} />
      </TabsContent>

      <TabsContent value="components" className="flex-1 m-0 overflow-hidden">
        <ComponentsPanel onInsertComponent={onInsertComponent} />
      </TabsContent>

      <TabsContent value="images" className="flex-1 m-0 overflow-hidden">
        <ImageUploader onInsertImage={onInsertImage} />
      </TabsContent>
    </Tabs>
  );
}
