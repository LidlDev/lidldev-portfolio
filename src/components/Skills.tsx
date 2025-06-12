
import React from "react";
import { Code, CheckCircle } from "lucide-react";

type SkillCategory = {
  name: string;
  icon: React.ReactNode;
  skills: string[];
};

const Skills: React.FC = () => {
  const skillCategories: SkillCategory[] = [
    {
      name: "Frontend Development",
      icon: <Code className="w-6 h-6" />,
      skills: [
        "React", "Next.js", "TypeScript", "JavaScript", 
        "HTML5", "CSS3", "Tailwind CSS", "SASS/SCSS", "SwiftUI"
      ]
    },
    {
      name: "Backend Development",
      icon: <Code className="w-6 h-6" />,
      skills: [
        "Node.js", "Express", "MongoDB", "PostgreSQL",
        "API Development", "Authentication", "GraphQL"
      ]
    },
    {
      name: "Tools & Platforms",
      icon: <Code className="w-6 h-6" />,
      skills: [
        "Git", "GitHub", "VS Code", "Docker", 
        "Webpack", "Vite", "AWS", "Vercel"
      ]
    },
    {
      name: "Design & Other",
      icon: <Code className="w-6 h-6" />,
      skills: [
        "Figma", "Adobe XD", "Responsive Design", "UI/UX", 
        "Accessibility", "Testing", "Performance Optimization"
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            My <span className="magic-text">Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I've worked with a variety of technologies in the web development world.
            Here's a snapshot of my technical expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl animate-fade-in" style={{animationDelay: `${idx * 150}ms`}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-md">
                  {category.icon}
                </div>
                <h3 className="text-xl font-display font-semibold">{category.name}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {category.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block glass-card p-5 rounded-2xl">
            <h3 className="font-display font-semibold text-xl mb-4">Current Focus</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["Next.js 14", "Tailwind CSS", "TypeScript", "React Server Components"].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-primary text-white rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
