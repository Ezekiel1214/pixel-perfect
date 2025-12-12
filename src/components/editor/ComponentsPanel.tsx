import { componentLibrary, ComponentItem } from "@/data/components";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComponentsPanelProps {
  onInsertComponent: (component: ComponentItem) => void;
}

const categories = [
  { id: "header", label: "Headers" },
  { id: "hero", label: "Heroes" },
  { id: "features", label: "Features" },
  { id: "testimonials", label: "Testimonials" },
  { id: "cta", label: "CTAs" },
  { id: "footer", label: "Footers" },
] as const;

export function ComponentsPanel({ onInsertComponent }: ComponentsPanelProps) {
  return (
    <Tabs defaultValue="header" className="h-full flex flex-col">
      <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 flex-wrap h-auto gap-1 py-2">
        {categories.map((cat) => (
          <TabsTrigger
            key={cat.id}
            value={cat.id}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs px-2 py-1"
          >
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <ScrollArea className="flex-1">
        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="m-0 p-4 space-y-3">
            {componentLibrary
              .filter((c) => c.category === cat.id)
              .map((component) => (
                <button
                  key={component.id}
                  onClick={() => onInsertComponent(component)}
                  className="w-full p-4 bg-muted/50 hover:bg-muted rounded-lg text-left transition-colors border border-border hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{component.thumbnail}</span>
                    <span className="font-medium text-foreground text-sm">{component.name}</span>
                  </div>
                </button>
              ))}
          </TabsContent>
        ))}
      </ScrollArea>
    </Tabs>
  );
}
