
import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} L.Dev. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <span>using React & Tailwind CSS</span>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-6">
            <a
              href="#home"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to top
            </a>
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
