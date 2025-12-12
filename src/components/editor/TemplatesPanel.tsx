import { templates, Template } from "@/data/templates";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplatesPanelProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplatesPanel({ onSelectTemplate }: TemplatesPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Starter Templates</h3>
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="w-full p-4 bg-muted/50 hover:bg-muted rounded-lg text-left transition-colors border border-border hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{template.thumbnail}</span>
              <div>
                <h4 className="font-medium text-foreground">{template.name}</h4>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
