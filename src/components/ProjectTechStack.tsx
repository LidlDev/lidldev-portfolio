import React from 'react';
import { Code, Database, Cloud, Wrench } from 'lucide-react';

interface TechStackCategory {
  category: string;
  technologies: string[];
}

interface ProjectTechStackProps {
  techStack: TechStackCategory[];
}

const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('mobile') || lowerCategory.includes('frontend')) {
    return Code;
  } else if (lowerCategory.includes('backend') || lowerCategory.includes('database')) {
    return Database;
  } else if (lowerCategory.includes('cloud') || lowerCategory.includes('services')) {
    return Cloud;
  } else {
    return Wrench;
  }
};

const ProjectTechStack: React.FC<ProjectTechStackProps> = ({ techStack }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold">Technology Stack</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {techStack.map((stack, index) => {
          const IconComponent = getCategoryIcon(stack.category);
          
          return (
            <div
              key={index}
              className="glass-card p-6 rounded-2xl hover-card"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold">
                  {stack.category}
                </h3>
              </div>
              
              {/* Technologies */}
              <div className="space-y-2">
                {stack.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Tech Stack Summary */}
      <div className="glass-card p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="text-center">
          <h3 className="text-xl font-display font-bold mb-4">
            Built with <span className="magic-text">Modern Technologies</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            This project leverages cutting-edge technologies and best practices to ensure 
            scalability, performance, and maintainability.
          </p>
          
          {/* All Technologies as Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.flatMap(stack => stack.technologies).map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary/70 text-secondary-foreground rounded-full text-xs font-medium hover:bg-secondary transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTechStack;
