import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Templates", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Community", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy", isRoute: true },
    { label: "Terms", href: "/terms", isRoute: true },
  ]
};

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-bold text-base sm:text-lg">AIWebBuilder</span>
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              One Brain. Seven Hands.
              <br />
              Build faster with AI.
            </p>
          </div>
          
          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.isRoute ? (
                      <Link 
                        to={link.href}
                        className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a 
                        href={link.href}
                        className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-primary-foreground/40">
            © {new Date().getFullYear()} AIWebBuilder Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="text-xs sm:text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-xs sm:text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              GitHub
            </a>
            <a href="#" className="text-xs sm:text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
