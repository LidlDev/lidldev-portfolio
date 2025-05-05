import React, { useState, useEffect } from "react";
import { Menu, X, Home, Briefcase, User, Mail, Code } from "lucide-react";

const NavigationBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", icon: Home, href: "#home" },
    { name: "About", icon: User, href: "#about" },
    { name: "Projects", icon: Briefcase, href: "#projects" },
    { name: "Skills", icon: Code, href: "#skills" },
    { name: "Contact", icon: Mail, href: "#contact" },
  ];

  const scrolled = scrollPosition > 20;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a
          href="#home"
          className="text-2xl font-display font-bold text-primary hover:text-accent transition-colors"
        >
          <span className="magic-text">LidlDev</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
            >
              <link.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
              {link.name}
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg p-4 flex flex-col space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
            >
              <link.icon className="h-5 w-5 text-primary" />
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
