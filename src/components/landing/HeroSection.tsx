import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/90" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-12">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur-sm mb-6 sm:mb-8">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
          <span className="text-xs sm:text-sm text-primary-foreground font-medium">Powered by Multi-AI Orchestration</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
          One Brain.
          <br />
          <span className="text-muted">Seven Hands.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
          The next-generation AI web builder that combines the power of multiple AI models 
          with real-time collaboration. Build production-ready websites in minutes, not months.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Button 
            variant="secondary"
            size="lg" 
            className="group px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto"
            onClick={() => navigate("/auth")}
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Start Building Free
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 w-full sm:w-auto"
          >
            Watch Demo
          </Button>
        </div>
        
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-primary-foreground/60 px-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary-foreground">10k+</div>
            <div className="text-xs sm:text-sm">Projects Built</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-primary-foreground/20" />
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary-foreground">99.9%</div>
            <div className="text-xs sm:text-sm">Uptime</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-primary-foreground/20" />
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary-foreground">50ms</div>
            <div className="text-xs sm:text-sm">Avg Response</div>
          </div>
        </div>
      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
