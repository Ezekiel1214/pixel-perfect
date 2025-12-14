import { Brain, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-bold text-base sm:text-lg">AIWebBuilder</span>
            <span className="text-xs px-1.5 py-0.5 bg-secondary text-secondary-foreground font-medium">
              Pro
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/auth" 
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Sign In
            </Link>
            <Button variant="secondary" size="sm" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-primary-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-primary-foreground/10 space-y-3">
                <Link 
                  to="/auth" 
                  className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Button variant="secondary" className="w-full" onClick={() => { setIsOpen(false); handleGetStarted(); }}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
