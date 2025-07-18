import React from "react";
import { Link } from "react-router-dom";
import { scrollToElement } from "../utils/scrollUtils";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleBackToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToElement("home");
  };

  return (
    <footer className="py-10 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} LidlDev. All rights reserved.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-6">
            <a
              href="#home"
              onClick={handleBackToTop}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to top
            </a>
            <Link
              to="/support"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Support
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
