import React from 'react';
import { ProjectData } from '../data/projects';

interface ProjectHeroProps {
  project: ProjectData;
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-bg opacity-30"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Project Logo - Special handling for Spike! */}
          {project.id === 'Spike' && project.logo && (
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-30 scale-110"></div>
                <img
                  src={project.logo}
                  alt={`${project.title} Logo`}
                  className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to a default image if logo fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Project Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="magic-text">{project.title}</span>
          </h1>
          
          {/* Project Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {project.description}
          </p>
          
          {/* Status Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-white/20 mb-8">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              project.status === 'completed' ? 'bg-green-500' :
              project.status === 'in-progress' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}></div>
            <span className="text-sm font-medium capitalize">
              {project.status.replace('-', ' ')}
            </span>
          </div>
          
          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <div className="relative glass-card rounded-3xl overflow-hidden hover-card">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default ProjectHero;
