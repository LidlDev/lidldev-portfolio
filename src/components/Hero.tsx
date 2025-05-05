
import React from "react";
import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-16 overflow-hidden relative pattern-bg"
    >
      <div className="absolute top-40 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-40 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className="flex flex-col gap-8 max-w-4xl">
          <div className="space-y-2 animate-fade-in">
            <p className="text-lg md:text-xl font-medium text-primary">Hello, I'm</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-balance">
              <span className="magic-text">Creative Developer</span> 
              <br />Crafting Digital Experiences
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl">
              I build beautiful, interactive web applications with modern technologies.
              Turning ideas into exceptional digital experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full bg-primary text-white px-6 py-3 text-base font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              View My Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-primary text-primary px-6 py-3 text-base font-medium hover:bg-primary/10 transition-colors"
            >
              Contact Me
            </a>
          </div>
          
          <div className="animate-bounce-subtle mt-12 text-center sm:text-left">
            <a href="#about" className="text-sm text-muted-foreground flex flex-col items-center sm:items-start">
              <span>Scroll down</span>
              <svg
                className="w-6 h-6 mt-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
