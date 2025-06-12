import { IMAGE_PATHS, getImagePath } from '../config/images';

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
  screenshots?: string[];
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
    id: "Spike",
    title: "Spike!",
    description: "Interactive app for volleyball teams, communication, and training.",
    detailedDescription: "Spike! is a comprehensive volleyball team management application designed to streamline communication, training, and team coordination. Built with modern mobile development practices, it provides coaches and players with powerful tools to enhance their volleyball experience. Using the powers of modern machine learning, we give players and coaches the tools of professional teams",
    tags: ["Java", "Swift", "Firebase"],
    imageUrl: getImagePath(IMAGE_PATHS.HEROES.SPIKE_VOLLEYBALL, IMAGE_PATHS.FALLBACKS.SPIKE_VOLLEYBALL_HERO),
    projectUrl: "https://example.com/spike",
    githubUrl: "https://github.com/LidlDev/SpikeIOS",
    featured: true,
    logo: getImagePath(IMAGE_PATHS.LOGOS.SPIKE_VOLLEYBALL, IMAGE_PATHS.FALLBACKS.SPIKE_VOLLEYBALL_HERO),
    screenshots: IMAGE_PATHS.SCREENSHOTS.SPIKE_VOLLEYBALL,
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
    demoDescription: "Experience the power of modern team management with Spike! This demo showcases the app's intuitive interface, real-time features, and comprehensive volleyball-specific machine learning tools designed to elevate your team's performance.",
    status: "in-progress",
    year: "2024-2025"
  },
  {
    id: "Chess",
    title: "Chess App",
    description: "A classic chess game implementation with AI opponent.",
    detailedDescription: "A sophisticated chess application featuring an intelligent AI opponent, beautiful 3D graphics, and comprehensive game analysis tools.",
    tags: ["Java", "Android", "Game Dev"],
    imageUrl: getImagePath(IMAGE_PATHS.HEROES.CHESS_APP, IMAGE_PATHS.FALLBACKS.CHESS_HERO),
    projectUrl: "https://example.com/chess",
    githubUrl: "https://github.com/username/chess",
    screenshots: IMAGE_PATHS.FALLBACKS.CHESS_SCREENSHOTS,
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
    id: "Uncharted",
    title: "Uncharted",
    description: "Explore the world around you, Be a tourist everywhere you go!",
    detailedDescription: "Uncharted is a travel discovery platform that helps you explore hidden gems and local attractions wherever you are.",
    tags: ["React", "Node.js", "Web"],
    imageUrl: getImagePath(IMAGE_PATHS.HEROES.UNCHARTED, IMAGE_PATHS.FALLBACKS.UNCHARTED_HERO),
    projectUrl: "https://example.com/projectx",
    githubUrl: "https://github.com/LidlDev/Uncharted",
    screenshots: IMAGE_PATHS.FALLBACKS.TRAVEL_SCREENSHOTS,
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
      },
      {
        title: "Achivements",
        description: "Make exploring the world more fun with smart achievements to track your progress.",
        icon: "trophy"
      }
    ],
    techStack: [
      {
        category: "Frontend",
        technologies: ["React", "TypeScript", "Expo go"]
      },
      {
        category: "Backend",
        technologies: ["Node.js", "Express", "PostgressSQL"]
      }
    ],
    demoDescription: "Discover amazing places and plan unforgettable adventures.",
    status: "in-progress",
    year: "2025"
  }
];
