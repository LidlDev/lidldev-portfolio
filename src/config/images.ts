// Image configuration for the portfolio
// All images should be stored in the public/images/ directory

export const IMAGE_PATHS = {
  // Project logos
  LOGOS: {
    SPIKE_VOLLEYBALL: '/images/projects/spike-volleyball/app_logo.png',
    CHESS_APP: '/images/projects/chess-app/logo.png',
    UNCHARTED: '/images/projects/uncharted/logo.png',
  },
  
  // Project hero images
  HEROES: {
    SPIKE_VOLLEYBALL: '/images/projects/spike-volleyball/hero.jpg',
    CHESS_APP: '/images/projects/chess-app/hero.jpg',
    UNCHARTED: '/images/projects/uncharted/hero.png',
  },
  
  // Project screenshots
  SCREENSHOTS: {
    SPIKE_VOLLEYBALL: [
      '/images/projects/spike-volleyball/screenshot-1.jpg',
      '/images/projects/spike-volleyball/screenshot-2.jpg',
      '/images/projects/spike-volleyball/screenshot-3.jpg',
      '/images/projects/spike-volleyball/screenshot-4.jpg',
    ],
    CHESS_APP: [
      '/images/projects/chess-app/screenshot-1.jpg',
      '/images/projects/chess-app/screenshot-2.jpg',
    ],
    UNCHARTED: [
      '/images/projects/uncharted/screenshot-1.jpg',
      '/images/projects/uncharted/screenshot-2.jpg',
    ],
  },
  
  // Fallback images (using Unsplash for now, replace with your actual images)
  FALLBACKS: {
    SPIKE_VOLLEYBALL_HERO: 'https://images.unsplash.com/photo-1592656094267-764a45160876?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=600',
    CHESS_HERO: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=600',
    UNCHARTED_HERO: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=600',
    
    // Volleyball-themed screenshots
    VOLLEYBALL_SCREENSHOTS: [
      'https://images.unsplash.com/photo-1592656094267-764a45160876?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
    ],
    
    // Chess-themed screenshots
    CHESS_SCREENSHOTS: [
      'https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
      'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
    ],
    
    // Travel-themed screenshots
    TRAVEL_SCREENSHOTS: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
    ],
  }
};

// Helper function to get image with fallback
export const getImagePath = (primaryPath: string, fallbackPath: string): string => {
  // In a real app, you might want to check if the image exists
  // For now, we'll use the fallback if the primary path doesn't start with '/images'
  return primaryPath.startsWith('/images') ? primaryPath : fallbackPath;
};

// Helper function to check if image exists (you can implement this later)
export const imageExists = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
