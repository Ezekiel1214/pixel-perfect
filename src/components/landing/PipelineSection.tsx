import { CheckCircle } from "lucide-react";

const pipelineSteps = [
  {
    name: "Grok",
    provider: "OpenAI",
    description: "Understands your intent and breaks down requirements"
  },
  {
    name: "Architect",
    provider: "OpenAI",
    description: "Designs the component structure and data flow"
  },
  {
    name: "UI/UX",
    provider: "OpenAI",
    description: "Creates beautiful, accessible interfaces"
  },
  {
    name: "Code",
    provider: "OpenAI",
    description: "Generates production-ready React components"
  },
  {
    name: "Debug",
    provider: "Claude",
    description: "Identifies and fixes potential issues"
  },
  {
    name: "Enhance",
    provider: "OpenAI",
    description: "Optimizes performance and adds polish"
  },
  {
    name: "Docs",
    provider: "Claude",
    description: "Generates comprehensive documentation"
  },
  {
    name: "Verify",
    provider: "Claude",
    description: "Final quality assurance and validation"
  }
];

export default function PipelineSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
            The One Brain — Seven Hands Pipeline
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Eight specialized AI agents working in harmony to transform your ideas into production-ready code.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-secondary via-primary to-secondary hidden md:block" />
          
          <div className="space-y-6">
            {pipelineSteps.map((step, index) => (
              <div 
                key={step.name}
                className="relative flex items-start gap-6 group"
              >
                {/* Step Number */}
                <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-background border-2 border-primary group-hover:bg-primary transition-colors shrink-0">
                  <span className="text-lg font-bold text-primary group-hover:text-primary-foreground transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-6 border-b border-border group-last:border-b-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {step.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground">
                      {step.provider}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                {/* Status */}
                <div className="shrink-0 hidden sm:block">
                  <CheckCircle className="w-5 h-5 text-muted opacity-30 group-hover:opacity-100 group-hover:text-secondary transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
