import { Brain } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Templates", "Integrations", "Changelog"],
  Resources: ["Documentation", "API Reference", "Community", "Blog", "Status"],
  Company: ["About", "Careers", "Contact", "Press", "Partners"],
  Legal: ["Privacy", "Terms", "Security", "Compliance"]
};

export default function Footer() {
  return (
    <footer className="py-16 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6" />
              <span className="font-bold text-lg">AIWebBuilder</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              One Brain. Seven Hands.
              <br />
              Build faster with AI.
            </p>
          </div>
          
          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/40">
            © 2024 AIWebBuilder Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              GitHub
            </a>
            <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
