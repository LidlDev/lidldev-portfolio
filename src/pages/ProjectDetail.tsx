import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar, Code } from 'lucide-react';
import { projectsData } from '../data/projects';
import SEO from '../components/SEO';
import ProjectHero from '../components/ProjectHero';
import DynamicProjectGallery from '../components/DynamicProjectGallery';
import ProjectFeatures from '../components/ProjectFeatures';
import ProjectTechStack from '../components/ProjectTechStack';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectsData.find(p => p.id === projectId);

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | LidlDev Portfolio`;
    }
    
    return () => {
      document.title = 'LidlDev Portfolio';
    };
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Link 
            to="/#projects" 
            className="inline-flex items-center text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${project.title} - Project Details`}
        description={project.detailedDescription}
        keywords={`${project.tags.join(', ')}, project, portfolio, ${project.title.toLowerCase()}`}
        url={`https://www.lidldev.com/project/${project.id}`}
        image={project.imageUrl}
        type="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.detailedDescription,
          "image": project.imageUrl,
          "url": `https://www.lidldev.com/project/${project.id}`,
          "author": {
            "@type": "Person",
            "name": "Harry",
            "alternateName": "LidlDev"
          },
          "dateCreated": project.year,
          "keywords": project.tags.join(', '),
          "genre": project.tags,
          "programmingLanguage": project.tags.filter(tag =>
            ['JavaScript', 'TypeScript', 'Swift', 'Java', 'Python', 'React', 'Node.js'].includes(tag)
          )
        }}
      />
      <NavigationBar />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <Link 
          to="/#projects" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      {/* Project Hero */}
      <ProjectHero project={project} />

      {/* Project Details */}
      <div className="container mx-auto px-4 py-16">
        {/* Project Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-12 pb-8 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{project.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code className="w-4 h-4" />
            <span className="capitalize">{project.status.replace('-', ' ')}</span>
          </div>
          <div className="flex gap-4 ml-auto">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Live Demo <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                <Github className="mr-2 w-4 h-4" />
                View Code
              </a>
            )}
            {project.id === 'Spike' && (
              <>
                <Link
                  to="/spike/privacy-policy"
                  className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/spike/terms-of-service"
                  className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/support"
                  className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Support
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Demo Description */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6">About This Project</h2>
          <div className="glass-card p-8 rounded-2xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {project.demoDescription}
            </p>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6">Project Overview</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed">
              {project.detailedDescription}
            </p>
          </div>
        </div>

        {/* Screenshots Gallery */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="mb-16">
            <DynamicProjectGallery screenshots={project.screenshots} title={project.title} />
          </div>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="mb-16">
            <ProjectFeatures features={project.features} />
          </div>
        )}

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-16">
            <ProjectTechStack techStack={project.techStack} />
          </div>
        )}

        {/* Tags */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
