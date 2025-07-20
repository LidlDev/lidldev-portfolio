import React from "react";
import { ExternalLink, Github, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { projectsData, ProjectData } from "../data/projects";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, HoverScale } from "./animations";

const ProjectCard: React.FC<{ project: ProjectData }> = ({ project }) => {
  const {
    id,
    title,
    description,
    tags,
    imageUrl,
    logo,
    projectUrl,
    githubUrl,
    featured = false,
    features,
    status,
    year,
  } = project;
  // Use logo for project card, fallback to imageUrl if no logo
  const displayImage = logo || imageUrl;

  if (featured) {
    return (
      <div className="group md:col-span-2 row-span-2 rounded-2xl overflow-hidden hover-card">
        <div className="glass-card h-full flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative h-48 md:h-full md:w-1/2 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-6">
            <img
              src={displayImage}
              alt={title}
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-primary text-white text-xs py-1 px-2 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </div>
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {year} • {status.replace('-', ' ')}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col flex-grow md:w-1/2">
            <h3 className="text-2xl font-display font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>

            {/* Key Features */}
            {features && features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 text-foreground">Key Features:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{feature.title}</span>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs py-1 px-2 bg-secondary rounded-full text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Link
                to={`/project/${id}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
              >
                View Details <ExternalLink className="ml-1 w-4 h-4" />
              </Link>
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Code <Github className="ml-1 w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular project card
  return (
    <div className="group rounded-2xl overflow-hidden hover-card">
      <div className="glass-card h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
          <img
            src={displayImage}
            alt={title}
            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-display font-bold">{title}</h3>
          <p className="text-muted-foreground mt-2 mb-4">{description}</p>

          {/* Key Features for regular cards */}
          {features && features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-foreground">Key Features:</h4>
              <div className="grid grid-cols-1 gap-2">
                {features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{feature.title}</span>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs py-1 px-2 bg-secondary rounded-full text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3 mt-auto">
            <Link
              to={`/project/${id}`}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              View Details <ExternalLink className="ml-1 w-4 h-4" />
            </Link>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Code <Github className="ml-1 w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {

  return (
    <section id="projects" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            My <span className="magic-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my recent work and personal projects. Each one represents a
            unique challenge and learning opportunity.
          </p>
        </motion.div>

        <StaggerContainer className={`grid gap-4 md:gap-6 auto-rows-fr ${
          projectsData.length === 1
            ? "grid-cols-1 max-w-2xl mx-auto"
            : projectsData.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : projectsData.length === 3
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}>
          {projectsData.map((project, index) => {
            return (
              <StaggerItem key={project.id}>
                <HoverScale>
                  <ProjectCard project={project} />
                </HoverScale>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Projects;
