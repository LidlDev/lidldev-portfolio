
import React from "react";
import { ExternalLink, Github, Star } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl?: string;
  githubUrl?: string;
  featured?: boolean;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  projectUrl,
  githubUrl,
  featured = false,
}) => {
  return (
    <div
      className={`group rounded-2xl overflow-hidden hover-card ${
        featured 
          ? "md:col-span-2 row-span-2" 
          : ""
      }`}
    >
      <div className="glass-card h-full flex flex-col">
        <div className="relative overflow-hidden h-48">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
            {projectUrl && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
              >
                Visit <ExternalLink className="ml-1 w-4 h-4" />
              </a>
            )}
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
  const projects: ProjectCardProps[] = [
    {
      title: "E-commerce Platform",
      description: "A full-featured online store with cart, checkout, and payment processing functionalities.",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      imageUrl: "https://images.unsplash.com/photo-1661956602944-249bcd04b63f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      projectUrl: "https://example.com/ecommerce",
      githubUrl: "https://github.com/username/ecommerce",
      featured: true,
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather forecasting app with interactive maps and alerts.",
      tags: ["React", "REST API", "Chart.js"],
      imageUrl: "https://images.unsplash.com/photo-1526743655626-e3d757b13db3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      projectUrl: "https://example.com/weather",
      githubUrl: "https://github.com/username/weather",
    },
    {
      title: "Task Manager",
      description: "Productivity app with task tracking, reminders and collaboration features.",
      tags: ["TypeScript", "Firebase", "Tailwind CSS"],
      imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80",
      projectUrl: "https://example.com/tasks",
      githubUrl: "https://github.com/username/tasks",
    },
    {
      title: "Portfolio Website",
      description: "Personal website showcasing projects and skills with modern design.",
      tags: ["React", "Tailwind CSS", "Framer Motion"],
      imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      projectUrl: "https://example.com",
      githubUrl: "https://github.com/username/portfolio",
    },
    {
      title: "Social Media App",
      description: "Connect with friends, share updates, and discover new content.",
      tags: ["React Native", "GraphQL", "AWS"],
      imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      projectUrl: "https://example.com/social",
      githubUrl: "https://github.com/username/social",
    },
  ];

  return (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
