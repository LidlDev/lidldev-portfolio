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
    detailedDescription: "A sophisticated chess application featuring an intelligent AI opponent with multiple difficulty levels, beautiful 3D graphics with smooth animations, and comprehensive game analysis tools. Built with modern Android development practices, this app provides an engaging chess experience for players of all skill levels, from beginners learning the game to advanced players seeking challenging opponents.",
    tags: ["Java", "Android", "Game Dev"],
    imageUrl: getImagePath(IMAGE_PATHS.HEROES.CHESS_APP, IMAGE_PATHS.FALLBACKS.CHESS_HERO),
    projectUrl: "https://example.com/chess",
    githubUrl: "https://github.com/username/chess",
    featured: true,
    screenshots: IMAGE_PATHS.FALLBACKS.CHESS_SCREENSHOTS,
    features: [
      {
        title: "AI Opponent",
        description: "Play against a challenging AI with multiple difficulty levels and adaptive learning capabilities.",
        icon: "cpu"
      },
      {
        title: "Game Analysis",
        description: "Analyze your games with detailed move-by-move breakdowns and strategic insights.",
        icon: "search"
      },
      {
        title: "3D Graphics",
        description: "Beautiful 3D chess board with smooth animations and realistic piece movements.",
        icon: "box"
      },
      {
        title: "Move History",
        description: "Complete game history with notation support and ability to replay any position.",
        icon: "history"
      },
      {
        title: "Difficulty Levels",
        description: "Multiple AI difficulty settings from beginner to grandmaster level challenges.",
        icon: "target"
      },
      {
        title: "Game Modes",
        description: "Various game modes including timed matches, puzzles, and training scenarios.",
        icon: "gamepad-2"
      }
    ],
    techStack: [
      {
        category: "Mobile Development",
        technologies: ["Java", "Android SDK", "Android Studio"]
      },
      {
        category: "Game Engine",
        technologies: ["Custom 3D Engine", "OpenGL ES", "Game Logic"]
      },
      {
        category: "AI & Algorithms",
        technologies: ["Minimax Algorithm", "Alpha-Beta Pruning", "Chess Engine"]
      },
      {
        category: "Development Tools",
        technologies: ["Git", "Gradle", "Android Debug Bridge"]
      }
    ],
    demoDescription: "Challenge yourself with this feature-rich chess application that combines beautiful 3D graphics with intelligent AI opponents. Perfect for both learning chess fundamentals and honing advanced strategies through comprehensive game analysis and multiple difficulty levels.",
    status: "completed",
    year: "2023"
  },
  {
    id: "Uncharted",
    title: "Uncharted",
    description: "Explore the world around you, Be a tourist everywhere you go!",
    detailedDescription: "Uncharted is a comprehensive travel discovery platform that helps you explore hidden gems and local attractions wherever you are. Built with React Native and powered by intelligent location services, it transforms every journey into an adventure by providing personalized recommendations, interactive maps, and social features that connect travelers with unique experiences and fellow explorers.",
    tags: ["React", "Node.js", "Web"],
    imageUrl: getImagePath(IMAGE_PATHS.HEROES.UNCHARTED, IMAGE_PATHS.FALLBACKS.UNCHARTED_HERO),
    projectUrl: "https://example.com/projectx",
    githubUrl: "https://github.com/LidlDev/Uncharted",
    featured: true,
    screenshots: IMAGE_PATHS.FALLBACKS.TRAVEL_SCREENSHOTS,
    features: [
      {
        title: "Location Discovery",
        description: "Find interesting places and hidden gems near you with intelligent location-based recommendations.",
        icon: "map-pin"
      },
      {
        title: "Travel Planning",
        description: "Plan your trips with personalized recommendations and smart itinerary generation.",
        icon: "route"
      },
      {
        title: "Achievements",
        description: "Make exploring the world more fun with smart achievements to track your progress and discoveries.",
        icon: "trophy"
      },
      {
        title: "Interactive Maps",
        description: "Explore with detailed interactive maps featuring points of interest and user reviews.",
        icon: "map"
      },
      {
        title: "Social Features",
        description: "Share your discoveries with friends and see recommendations from fellow travelers.",
        icon: "users"
      },
      {
        title: "Offline Mode",
        description: "Access your saved places and maps even when you're offline during your adventures.",
        icon: "wifi-off"
      }
    ],
    techStack: [
      {
        category: "Frontend",
        technologies: ["React Native", "TypeScript", "Expo", "React Navigation"]
      },
      {
        category: "Backend",
        technologies: ["Node.js", "Express", "PostgreSQL", "RESTful APIs"]
      },
      {
        category: "Maps & Location",
        technologies: ["Google Maps API", "Geolocation API", "Places API"]
      },
      {
        category: "Development Tools",
        technologies: ["Git", "ESLint", "Metro Bundler", "Expo CLI"]
      }
    ],
    demoDescription: "Discover amazing places and plan unforgettable adventures with Uncharted's intelligent travel companion. Explore hidden gems, connect with fellow travelers, and turn every journey into a rewarding experience with personalized recommendations and achievement tracking.",
    status: "in-progress",
    year: "2025"
  },
  {
    id: "Agent",
    title: "Agent Dashboard",
    description: "Comprehensive personal productivity and life management platform with AI-powered insights.",
    detailedDescription: "Agent Dashboard is a sophisticated personal productivity platform that combines task management, financial tracking, note-taking, calendar integration, and project management into a unified experience. Built with modern web technologies and powered by Supabase, it provides users with powerful tools to organize their digital life while maintaining complete privacy and security through Row Level Security (RLS).",
    tags: ["React", "TypeScript", "Supabase"],
    imageUrl: getImagePath(IMAGE_PATHS.HEROES.AGENT_APP, IMAGE_PATHS.FALLBACKS.AGENT_APP_HERO),
    projectUrl: "https://www.lidldev.com/agent",
    githubUrl: "https://github.com/LidlDev/lidldev-portfolio",
    featured: true,
    logo: getImagePath(IMAGE_PATHS.LOGOS.AGENT_APP, IMAGE_PATHS.FALLBACKS.AGENT_APP_HERO),
    screenshots: IMAGE_PATHS.SCREENSHOTS.AGENT_APP,
    features: [
      {
        title: "Smart Dashboard",
        description: "Comprehensive overview with real-time analytics, progress tracking, and quick actions for all your productivity metrics.",
        icon: "bar-chart"
      },
      {
        title: "Advanced Task Management",
        description: "Intelligent task organization with priorities, categories, due dates, time estimates, and smart filtering capabilities.",
        icon: "check-circle"
      },
      {
        title: "Financial Tracking",
        description: "Complete budget management with expense tracking, financial goals, spending analytics, and automated payment reminders.",
        icon: "dollar-sign"
      },
      {
        title: "Rich Note-Taking",
        description: "Markdown-powered notes with categories, tags, search functionality, and seamless organization for all your thoughts.",
        icon: "file-text"
      },
      {
        title: "Project Management",
        description: "Kanban-style project boards with task assignments, progress tracking, and collaborative features for team productivity.",
        icon: "folder-kanban"
      },
      {
        title: "Calendar Integration",
        description: "Unified calendar view with event management, task scheduling, and multiple view modes for optimal time management.",
        icon: "calendar"
      },
      {
        title: "Habit Tracking",
        description: "Build and maintain positive habits with streak tracking, progress visualization, and motivational insights.",
        icon: "target"
      },
      {
        title: "Secure Authentication",
        description: "Google OAuth integration with Supabase authentication, ensuring secure access and data privacy with RLS policies.",
        icon: "shield"
      }
    ],
    techStack: [
      {
        category: "Frontend",
        technologies: ["React 18", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide Icons"]
      },
      {
        category: "Backend & Database",
        technologies: ["Supabase", "PostgreSQL", "Row Level Security (RLS)", "Real-time subscriptions"]
      },
      {
        category: "Authentication",
        technologies: ["Supabase Auth", "Google OAuth", "JWT tokens", "Session management"]
      },
      {
        category: "Development Tools",
        technologies: ["Vite", "ESLint", "Prettier", "Git", "Vercel deployment"]
      },
      {
        category: "Features",
        technologies: ["PWA support", "Responsive design", "Dark/Light themes", "Real-time updates"]
      }
    ],
    demoDescription: "Experience the future of personal productivity with Agent Dashboard. This comprehensive platform showcases modern web development practices, secure authentication, real-time data synchronization, and an intuitive user interface designed for maximum efficiency and user satisfaction.",
    status: "completed",
    year: "2024-2025"
  },
  {
    id: "Pyreus",
    title: "Pyreus",
    description: "Intelligent personal operating system combining productivity, knowledge management, and development tools with AI-powered insights.",
    detailedDescription: "Pyreus is envisioned as an intelligent, all-encompassing hub designed to integrate and optimize both personal life management and professional development workflows. It acts as a 'personal operating system' that unifies tasks, knowledge, communication, and development tools into a cohesive, AI-powered experience. A critical distinguishing feature is its integrated, secure Code Sandboxing and Live UI Preview, elevating it beyond a traditional productivity suite to an interactive development environment.",
    tags: ["React", "TypeScript", "Electron", "Node.js", "AI/ML", "Docker"],
    imageUrl: getImagePath(IMAGE_PATHS.HEROES.PYREUS, IMAGE_PATHS.FALLBACKS.PYREUS_HERO),
    projectUrl: "https://github.com/LidlDev/Pyreus",
    githubUrl: "https://github.com/LidlDev/Pyreus",
    featured: true,
    logo: getImagePath(IMAGE_PATHS.LOGOS.PYREUS, IMAGE_PATHS.FALLBACKS.PYREUS_HERO),
    screenshots: IMAGE_PATHS.SCREENSHOTS.PYREUS,
    features: [
      {
        title: "Intelligent Task Management",
        description: "AI-driven dynamic prioritization and smart scheduling with unified task & calendar interface.",
        icon: "brain"
      },
      {
        title: "Knowledge Management Hub",
        description: "Comprehensive second brain with bi-directional linking, rich text editing, and AI-powered auto-tagging.",
        icon: "book-open"
      },
      {
        title: "Code Sandboxing & Live Preview",
        description: "Secure code execution environment with live UI preview for multiple programming languages and frameworks.",
        icon: "code"
      },
      {
        title: "Mind Mapping & Whiteboard",
        description: "Infinite canvas for visual thinking with integrated mind maps that convert directly to tasks.",
        icon: "map"
      },
      {
        title: "AI Development Assistant",
        description: "Natural language command palette for code generation, analysis, and development workflow automation.",
        icon: "bot"
      },
      {
        title: "Integrated Development Environment",
        description: "Git integration, IDE plugins, and comprehensive development workflow management.",
        icon: "git-branch"
      }
    ],
    techStack: [
      {
        category: "Frontend",
        technologies: ["React.js", "TypeScript", "Electron", "Tailwind CSS", "Radix UI", "Framer Motion"]
      },
      {
        category: "Backend",
        technologies: ["Node.js", "NestJS", "Python", "FastAPI", "PostgreSQL", "Neo4j", "Redis"]
      },
      {
        category: "AI & Machine Learning",
        technologies: ["OpenAI API", "Anthropic Claude", "TensorFlow.js", "Natural Language Processing"]
      },
      {
        category: "Code Execution & Security",
        technologies: ["Docker", "Kubernetes", "Puppeteer", "Playwright", "Container Orchestration"]
      },
      {
        category: "Development Tools",
        technologies: ["Vite", "Zustand", "React Query", "Prisma", "Git", "VS Code Extensions"]
      }
    ],
    demoDescription: "Pyreus represents the future of personal productivity and development environments. This ambitious project combines the best of task management, knowledge organization, and development tools into a single, AI-powered platform. With its unique code sandboxing capabilities and live UI preview features, Pyreus goes beyond traditional productivity apps to become a true 'personal operating system' for developers and knowledge workers.",
    status: "in-progress",
    year: "2024-2025"
  }
];
