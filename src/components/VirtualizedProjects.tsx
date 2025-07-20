import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FixedSizeGrid as Grid } from 'react-window';
import { projectsData, ProjectData } from '../data/projects';
import { StaggerContainer, StaggerItem, HoverScale } from './animations';
import { debounce, shouldReduceAnimations } from '../utils/performance';

interface VirtualizedProjectsProps {
  searchQuery?: string;
  category?: string;
  itemsPerRow?: number;
  itemHeight?: number;
  containerHeight?: number;
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    projects: ProjectData[];
    itemsPerRow: number;
    onProjectClick: (project: ProjectData) => void;
    reduceAnimations: boolean;
  };
}

const ProjectGridItem: React.FC<GridItemProps> = ({ 
  columnIndex, 
  rowIndex, 
  style, 
  data 
}) => {
  const { projects, itemsPerRow, onProjectClick, reduceAnimations } = data;
  const index = rowIndex * itemsPerRow + columnIndex;
  const project = projects[index];

  if (!project) {
    return <div style={style} />;
  }

  return (
    <div style={style} className="p-2">
      <motion.div
        className="h-full"
        whileHover={!reduceAnimations ? { scale: 1.02, y: -4 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div 
          className="bg-card border border-border rounded-lg p-4 h-full cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onProjectClick(project)}
        >
          <div className="flex items-center space-x-3 mb-3">
            {project.logo && (
              <img
                src={project.logo}
                alt={`${project.title} logo`}
                className="w-8 h-8 rounded object-cover"
                loading="lazy"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {project.year}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs rounded-full ${
              project.status === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : project.status === 'in-progress'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {project.status}
            </span>
            
            {project.featured && (
              <span className="text-yellow-500 text-sm">★</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const VirtualizedProjects: React.FC<VirtualizedProjectsProps> = ({
  searchQuery = '',
  category = '',
  itemsPerRow = 3,
  itemHeight = 280,
  containerHeight = 600
}) => {
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    // Check if animations should be reduced
    shouldReduceAnimations().then(setReduceAnimations);
  }, []);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = projectsData;

    // Filter by category
    if (category) {
      filtered = filtered.filter(project => 
        project.tags.some(tag => 
          tag.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, category]);

  // Calculate grid dimensions
  const rowCount = Math.ceil(filteredProjects.length / itemsPerRow);
  const columnWidth = 100 / itemsPerRow; // Percentage

  // Handle project click
  const handleProjectClick = useCallback((project: ProjectData) => {
    setSelectedProject(project);
    // You could also navigate to project detail page here
    console.log('Project clicked:', project.title);
  }, []);

  // Debounced search to improve performance
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      // This would typically update a parent component's search state
      console.log('Search query:', query);
    }, 300),
    []
  );

  // Grid item data
  const itemData = useMemo(() => ({
    projects: filteredProjects,
    itemsPerRow,
    onProjectClick: handleProjectClick,
    reduceAnimations
  }), [filteredProjects, itemsPerRow, handleProjectClick, reduceAnimations]);

  if (filteredProjects.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">No projects found</p>
          <p className="text-sm">
            {searchQuery 
              ? `No projects match "${searchQuery}"`
              : category 
              ? `No projects in "${category}" category`
              : 'No projects available'
            }
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project count and filters */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </p>
        
        {reduceAnimations && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            Reduced animations
          </span>
        )}
      </motion.div>

      {/* Virtualized grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid
          columnCount={itemsPerRow}
          columnWidth={300} // Fixed width in pixels
          height={containerHeight}
          rowCount={rowCount}
          rowHeight={itemHeight}
          itemData={itemData}
          className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        >
          {ProjectGridItem}
        </Grid>
      </motion.div>

      {/* Performance info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="text-xs text-muted-foreground bg-muted p-2 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Performance: Virtualized {filteredProjects.length} items in {rowCount} rows</p>
          <p>Rendered: ~{Math.min(Math.ceil(containerHeight / itemHeight) * itemsPerRow, filteredProjects.length)} visible items</p>
        </motion.div>
      )}
    </div>
  );
};

export default VirtualizedProjects;
