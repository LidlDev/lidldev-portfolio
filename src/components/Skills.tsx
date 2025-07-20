
import React from "react";
import {
  Code,
  Database,
  Smartphone,
  Monitor,
  Server,
  Globe,
  Palette,
  Settings,
  Zap,
  GitBranch,
  Cloud,
  Layers,
  Cpu,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "./animations";
import { GlassCard } from "./ui/GlassmorphismComponents";

type Skill = {
  name: string;
  icon: React.ReactNode;
  level: 'Expert' | 'Advanced' | 'Intermediate';
  category: string;
};

const Skills: React.FC = () => {
  const skills: Skill[] = [
    // Frontend
    { name: "React", icon: <Code className="w-5 h-5" />, level: "Expert", category: "Frontend" },
    { name: "Next.js", icon: <Globe className="w-5 h-5" />, level: "Expert", category: "Frontend" },
    { name: "TypeScript", icon: <Code className="w-5 h-5" />, level: "Expert", category: "Frontend" },
    { name: "JavaScript", icon: <Zap className="w-5 h-5" />, level: "Expert", category: "Frontend" },
    { name: "SwiftUI", icon: <Smartphone className="w-5 h-5" />, level: "Advanced", category: "Mobile" },
    { name: "Tailwind CSS", icon: <Palette className="w-5 h-5" />, level: "Expert", category: "Frontend" },

    // Backend
    { name: "Node.js", icon: <Server className="w-5 h-5" />, level: "Advanced", category: "Backend" },
    { name: "MongoDB", icon: <Database className="w-5 h-5" />, level: "Advanced", category: "Backend" },
    { name: "PostgreSQL", icon: <Database className="w-5 h-5" />, level: "Advanced", category: "Backend" },
    { name: "GraphQL", icon: <Layers className="w-5 h-5" />, level: "Intermediate", category: "Backend" },

    // Tools & Platforms
    { name: "Git", icon: <GitBranch className="w-5 h-5" />, level: "Expert", category: "Tools" },
    { name: "Docker", icon: <Cpu className="w-5 h-5" />, level: "Intermediate", category: "Tools" },
    { name: "AWS", icon: <Cloud className="w-5 h-5" />, level: "Intermediate", category: "Cloud" },
    { name: "Vercel", icon: <Cloud className="w-5 h-5" />, level: "Advanced", category: "Cloud" },

    // Design & Other
    { name: "Figma", icon: <Palette className="w-5 h-5" />, level: "Advanced", category: "Design" },
    { name: "UI/UX Design", icon: <Monitor className="w-5 h-5" />, level: "Advanced", category: "Design" },
    { name: "Firebase", icon: <Shield className="w-5 h-5" />, level: "Advanced", category: "Backend" },
    { name: "Supabase", icon: <Database className="w-5 h-5" />, level: "Advanced", category: "Backend" },
  ];

  const categories = [
    { name: "Frontend", icon: <Code className="w-6 h-6" />, color: "from-blue-500/20 to-cyan-500/20" },
    { name: "Backend", icon: <Server className="w-6 h-6" />, color: "from-green-500/20 to-emerald-500/20" },
    { name: "Mobile", icon: <Smartphone className="w-6 h-6" />, color: "from-purple-500/20 to-pink-500/20" },
    { name: "Tools", icon: <Settings className="w-6 h-6" />, color: "from-orange-500/20 to-red-500/20" },
    { name: "Cloud", icon: <Cloud className="w-6 h-6" />, color: "from-indigo-500/20 to-blue-500/20" },
    { name: "Design", icon: <Palette className="w-6 h-6" />, color: "from-pink-500/20 to-rose-500/20" },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Advanced': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section id="skills" className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            My <span className="magic-text">Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise across different domains.
          </p>
        </motion.div>

        {/* Skills by Category */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {categories.map((category, categoryIdx) => {
            const categorySkills = skills.filter(skill => skill.category === category.name);
            if (categorySkills.length === 0) return null;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: categoryIdx * 0.1 }}
              >
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-display font-bold">{category.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categorySkills.map((skill, skillIdx) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: skillIdx * 0.05 }}
                        className="group"
                      >
                        <div className="glass-card p-4 rounded-xl hover:scale-105 transition-all duration-300 border border-border/50 hover:border-primary/30">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-primary group-hover:text-accent transition-colors">
                              {skill.icon}
                            </div>
                            <span className="font-medium text-sm">{skill.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Current Focus - Enhanced */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassCard className="inline-block p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl">Current Focus</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Technologies I'm actively working with and exploring in my latest projects.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Next.js 14", icon: <Globe className="w-4 h-4" /> },
                { name: "Tailwind CSS", icon: <Palette className="w-4 h-4" /> },
                { name: "TypeScript", icon: <Code className="w-4 h-4" /> },
                { name: "Supabase", icon: <Database className="w-4 h-4" /> }
              ].map((tech) => (
                <div key={tech.name} className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full text-sm font-medium transition-colors group">
                  <span className="text-primary group-hover:text-accent transition-colors">
                    {tech.icon}
                  </span>
                  {tech.name}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
