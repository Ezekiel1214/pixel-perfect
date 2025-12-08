import { Brain, Users, Gauge, Shield, Sparkles, Workflow, MessageSquare, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "One Brain Orchestration",
    description: "Central AI coordinator that intelligently routes tasks to specialized models for optimal results."
  },
  {
    icon: Workflow,
    title: "Seven Hands Pipeline",
    description: "From prompt to production: Grok → Architect → UI/UX → Code → Debug → Enhance → Verify."
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "See teammates' cursors, lock components, and chat live while building together."
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "Watch your website materialize in real-time as AI generates each component."
  },
  {
    icon: Gauge,
    title: "Cost Transparency",
    description: "Preview mode for zero-cost estimates. Track token usage and costs per job in real-time."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "RLS policies, encrypted secrets, rate limiting, and comprehensive audit trails."
  },
  {
    icon: MessageSquare,
    title: "Integrated Chat",
    description: "Built-in team communication with presence indicators and message history."
  },
  {
    icon: Sparkles,
    title: "Session Replay",
    description: "Replay any session to understand how your project evolved over time."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Build at Scale
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete platform that combines AI-powered generation with collaborative workflows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group border-border hover:border-primary transition-colors duration-300"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 flex items-center justify-center bg-secondary/50 group-hover:bg-secondary transition-colors mb-4">
                  <feature.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
