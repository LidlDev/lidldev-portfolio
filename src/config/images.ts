// Image configuration for the portfolio
// All images should be stored in the public/images/ directory

export const IMAGE_PATHS = {
  // Profile images
  PROFILE: {
    HARRY: '/images/Harry.png',
  },

  // Project logos
  LOGOS: {
    SPIKE_VOLLEYBALL: '/images/projects/spike-volleyball/app_logo.png',
    CHESS_APP: '/images/projects/chess-app/logo.png',
    UNCHARTED: '/images/projects/uncharted/logo.png',
    AGENT_APP: '/images/projects/agent-app/logo.svg',
    PYREUS: '/images/projects/pyreus/icon.png',
  },
  
  // Project hero images
  HEROES: {
    SPIKE_VOLLEYBALL: '/images/projects/spike-volleyball/hero.jpg',
    CHESS_APP: '/images/projects/chess-app/hero.jpg',
    UNCHARTED: '/images/projects/uncharted/hero.png',
    AGENT_APP: '/images/projects/agent-app/hero.jpg',
    PYREUS: '/images/projects/pyreus/hero.png',
  },
  
  // Project screenshots
  SCREENSHOTS: {
    SPIKE_VOLLEYBALL: [
      '/images/projects/spike-volleyball/Home - large.jpg',
      '/images/projects/spike-volleyball/Team - large.jpg',
      '/images/projects/spike-volleyball/Stats - large.jpg',
      '/images/projects/spike-volleyball/Lineups - large.jpg',
      '/images/projects/spike-volleyball/Tactics - large.jpg',
      '/images/projects/spike-volleyball/Training - large.jpg',
      '/images/projects/spike-volleyball/VolleyChat - large.jpg',
      '/images/projects/spike-volleyball/Competitions - large.jpg',
      '/images/projects/spike-volleyball/Coaches Tools - large.jpg',
      '/images/projects/spike-volleyball/Development - large.jpg',
    ],
    CHESS_APP: [
      '/images/projects/chess-app/screenshot-1.jpg',
      '/images/projects/chess-app/screenshot-2.jpg',
    ],
    UNCHARTED: [
      '/images/projects/uncharted/screenshot-1.jpg',
      '/images/projects/uncharted/screenshot-2.jpg',
    ],
    AGENT_APP: [
      '/images/projects/agent-app/dashboard.jpg',
      '/images/projects/agent-app/tasks.jpg',
      '/images/projects/agent-app/notes.jpg',
      '/images/projects/agent-app/budget-goals.jpg',
      '/images/projects/agent-app/projects.jpg',
      '/images/projects/agent-app/spending-payments.jpg',
      '/images/projects/agent-app/calendar.jpg',
    ],
    PYREUS: [
      '/images/projects/pyreus/hero.png',
      '/images/projects/pyreus/screenshot-02.png',
      '/images/projects/pyreus/screenshot-03.png',
      '/images/projects/pyreus/screenshot-04.png',
      '/images/projects/pyreus/screenshot-05.png',
      '/images/projects/pyreus/screenshot-06.png',
      '/images/projects/pyreus/screenshot-07.png',
      '/images/projects/pyreus/screenshot-08.png',
      '/images/projects/pyreus/screenshot-09.png',
      '/images/projects/pyreus/screenshot-10.png',
      '/images/projects/pyreus/screenshot-11.png',
      '/images/projects/pyreus/screenshot-12.png',
      '/images/projects/pyreus/screenshot-13.png',
      '/images/projects/pyreus/screenshot-14.png',
      '/images/projects/pyreus/screenshot-15.png',
      '/images/projects/pyreus/screenshot-16.png',
      '/images/projects/pyreus/screenshot-17.png',
      '/images/projects/pyreus/screenshot-18.png',
    ],
  },
  
  // Fallback images (using Unsplash for now, replace with your actual images)
  FALLBACKS: {
    SPIKE_VOLLEYBALL_HERO: 'https://images.unsplash.com/photo-1592656094267-764a45160876?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=600',
    CHESS_HERO: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=600',
    UNCHARTED_HERO: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=600',
    AGENT_APP_HERO: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=600',
    PYREUS_HERO: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=600',
    
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

    // Agent app screenshots
    AGENT_APP_SCREENSHOTS: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=600',
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
