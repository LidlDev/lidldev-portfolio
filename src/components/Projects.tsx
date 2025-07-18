import React from "react";
import { ExternalLink, Github, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { projectsData, ProjectData } from "../data/projects";
import LazyImage from "./LazyImage";
import LazySection from "./LazySection";
import AnimatedCard from "./AnimatedCard";
import { staggerContainer, staggerItem } from "../utils/animations";

const ProjectCard: React.FC<{ project: ProjectData }> = ({ project }) => {
  const {
    id,
    title,
    description,
    tags,
    imageUrl,
    projectUrl,
    githubUrl,
    featured = false,
  } = project;
  return (
    <motion.div
      className={`group rounded-2xl overflow-hidden ${
        featured
          ? "md:col-span-2 row-span-2"
          : ""
      }`}
      variants={staggerItem}
    >
      <AnimatedCard
        variant="glass"
        hover="lift"
        className="h-full flex flex-col"
      >
        <div className="relative overflow-hidden h-48">
          <LazyImage
            src={imageUrl}
            alt={title}
            className="w-full h-full transition-transform duration-500 group-hover:scale-110"
            priority={featured}
          />
          {featured && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs py-1 px-2 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-display font-bold">{title}</h3>
          <p className="text-muted-foreground mt-2 mb-4 flex-grow">{description}</p>
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
      </AnimatedCard>
    </motion.div>
  );
};

const Projects: React.FC = () => {

  return (
    <LazySection>
      <section id="projects" className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              My <span className="magic-text">Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore my recent work and personal projects. Each one represents a
              unique challenge and learning opportunity.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {projectsData.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </div>
      </section>
    </LazySection>
  );
};

export default Projects;
