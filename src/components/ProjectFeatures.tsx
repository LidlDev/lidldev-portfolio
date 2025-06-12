import React from 'react';
import { 
  Users, 
  Calendar, 
  BarChart, 
  MessageCircle, 
  BookOpen, 
  Trophy,
  Cpu,
  Search,
  MapPin,
  Route,
  LucideIcon
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface ProjectFeaturesProps {
  features: Feature[];
}

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  calendar: Calendar,
  'bar-chart': BarChart,
  'message-circle': MessageCircle,
  'book-open': BookOpen,
  trophy: Trophy,
  cpu: Cpu,
  search: Search,
  'map-pin': MapPin,
  route: Route,
};

const ProjectFeatures: React.FC<ProjectFeaturesProps> = ({ features }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold">Key Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = iconMap[feature.icon] || Users;
          
          return (
            <div
              key={index}
              className="group glass-card p-6 rounded-2xl hover-card"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          );
        })}
      </div>
      
      {/* Feature Highlight */}
      <div className="mt-12 glass-card p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="text-center">
          <h3 className="text-xl font-display font-bold mb-4">
            Designed for <span className="magic-text">Excellence</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every feature is carefully crafted to provide the best user experience, 
            combining modern design principles with powerful functionality to deliver 
            exceptional results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectFeatures;
