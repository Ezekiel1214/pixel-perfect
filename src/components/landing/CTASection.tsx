import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-primary">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
          Ready to Build the Future?
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          Join thousands of developers and teams who are shipping faster with AIWebBuilder Pro.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="secondary"
            size="lg"
            className="group px-8 py-6 text-lg font-semibold"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Building Free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outlinePrimary"
            size="lg"
            className="px-8 py-6 text-lg font-semibold"
          >
            Schedule Demo
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-primary-foreground/60">
          No credit card required. Start building in under 2 minutes.
        </p>
      </div>
    </section>
  );
}
