export interface ProjectData {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  tags: string[];
  imageUrl: string;
  projectUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  logo?: string;
  screenshots: string[];
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  techStack: {
    category: string;
    technologies: string[];
  }[];
  demoDescription: string;
  status: 'completed' | 'in-progress' | 'concept';
  year: string;
}

export const projectsData: ProjectData[] = [
  {
    id: "spike-volleyball",
    title: "Spike! Volleyball App",
    description: "Interactive app for volleyball teams, communication, and training.",
    detailedDescription: "Spike! is a comprehensive volleyball team management application designed to streamline communication, training, and team coordination. Built with modern mobile development practices, it provides coaches and players with powerful tools to enhance their volleyball experience.",
    tags: ["Java", "Swift", "Firebase"],
    imageUrl: "https://images.unsplash.com/photo-1592656094267-764a45160876?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
    projectUrl: "https://example.com/spike",
    githubUrl: "https://github.com/username/spike",
    featured: true,
    logo: "/src/assets/images/app_logo.png",
    screenshots: [
      "https://images.unsplash.com/photo-1592656094267-764a45160876?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
    ],
    features: [
      {
        title: "Team Management",
        description: "Organize players, track attendance, and manage team rosters with ease.",
        icon: "users"
      },
      {
        title: "Training Scheduler",
        description: "Schedule practices, games, and events with automated notifications.",
        icon: "calendar"
      },
      {
        title: "Performance Analytics",
        description: "Track player statistics and team performance metrics over time.",
        icon: "bar-chart"
      },
      {
        title: "Real-time Chat",
        description: "Instant messaging for team communication and coordination.",
        icon: "message-circle"
      },
      {
        title: "Drill Library",
        description: "Access to a comprehensive library of volleyball training drills.",
        icon: "book-open"
      },
      {
        title: "Match Tracking",
        description: "Record match results, scores, and player performance data.",
        icon: "trophy"
      }
    ],
    techStack: [
      {
        category: "Mobile Development",
        technologies: ["Java (Android)", "Swift (iOS)", "React Native"]
      },
      {
        category: "Backend & Database",
        technologies: ["Firebase", "Cloud Firestore", "Firebase Auth"]
      },
      {
        category: "Cloud Services",
        technologies: ["Firebase Cloud Functions", "Firebase Storage", "Push Notifications"]
      },
      {
        category: "Development Tools",
        technologies: ["Android Studio", "Xcode", "Git", "Firebase Console"]
      }
    ],
    demoDescription: "Experience the power of modern team management with Spike! This demo showcases the app's intuitive interface, real-time features, and comprehensive volleyball-specific tools designed to elevate your team's performance.",
    status: "completed",
    year: "2023"
  },
  {
    id: "chess-app",
    title: "Chess App",
    description: "A classic chess game implementation with AI opponent.",
    detailedDescription: "A sophisticated chess application featuring an intelligent AI opponent, beautiful 3D graphics, and comprehensive game analysis tools.",
    tags: ["Java", "Android", "Game Dev"],
    imageUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
    projectUrl: "https://example.com/chess",
    githubUrl: "https://github.com/username/chess",
    screenshots: [
      "https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
    ],
    features: [
      {
        title: "AI Opponent",
        description: "Play against a challenging AI with multiple difficulty levels.",
        icon: "cpu"
      },
      {
        title: "Game Analysis",
        description: "Analyze your games with detailed move-by-move breakdowns.",
        icon: "search"
      }
    ],
    techStack: [
      {
        category: "Mobile Development",
        technologies: ["Java", "Android SDK"]
      }
    ],
    demoDescription: "Challenge yourself with this feature-rich chess application.",
    status: "completed",
    year: "2023"
  },
  {
    id: "uncharted",
    title: "Uncharted",
    description: "Explore the world around you, Be a tourist everywhere you go!",
    detailedDescription: "Uncharted is a travel discovery platform that helps you explore hidden gems and local attractions wherever you are.",
    tags: ["React", "Node.js", "Web"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb",
    projectUrl: "https://example.com/projectx",
    githubUrl: "https://github.com/username/projectx",
    screenshots: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
    ],
    features: [
      {
        title: "Location Discovery",
        description: "Find interesting places and attractions near you.",
        icon: "map-pin"
      },
      {
        title: "Travel Planning",
        description: "Plan your trips with personalized recommendations.",
        icon: "route"
      }
    ],
    techStack: [
      {
        category: "Frontend",
        technologies: ["React", "TypeScript"]
      },
      {
        category: "Backend",
        technologies: ["Node.js", "Express"]
      }
    ],
    demoDescription: "Discover amazing places and plan unforgettable adventures.",
    status: "in-progress",
    year: "2024"
  }
];
