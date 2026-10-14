export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: string;
  summary: string;
  stack: string[];
  github?: string;
  site?: string;
  visual: "cadence" | "brain" | "image";
  image?: string;
  images: string[];
  problem: string;
  decisions: {
    title: string;
    text: string;
  }[];
  overview: string;
  infrastructure: string;
  technologies: { title: string; text: string }[];
  evidence?: string;
  next: string;
}
export const projects: Project[] = [
  {
    id: "cadence-mobile",
    title: "Cadence",
    tagline: "Find your rhythm.",
    category: "Mobile · Running & training",
    visual: "cadence",
    summary:
      "A mobile running companion connecting weekly training, race predictions, recovery and nutrition in one practical dashboard.",
    stack: ["React Native", "Expo", "TypeScript", "Supabase", "HealthKit"],
    github: "https://github.com/LidlDev/cadence-mobile",
    images: [],
    problem:
      "Training data lives across workouts, calendars and health records. Cadence brings those parts into a mobile experience built around the runner’s week.",
    decisions: [
      {
        title: "Training that adds up",
        text: "Weekly mileage, planned and completed runs, personal bests and summary cards put individual sessions into context. Separate strength and nutrition tabs make supporting habits part of the training experience.",
      },
      {
        title: "Race results into useful targets",
        text: "The VDOT module translates race performances into estimated paces and race predictions. Performance changes can inform dashboard feedback and notifications, giving recorded results a practical role in planning.",
      },
      {
        title: "Recovery alongside effort",
        text: "HealthKit and dedicated recovery views connect training with sleep and heart-rate information. The app makes those signals visible alongside the schedule rather than leaving recovery in a separate tool.",
      },
    ],
    next: "Continue refining the connections between training, recovery and the daily mobile experience.",
    overview:
      "Cadence turns a collection of training records into a clearer picture of the runner’s week. Planned sessions, completed mileage, personal bests and recovery sit alongside strength and nutrition, helping the next workout make sense in the context of the whole plan.",
    infrastructure:
      "The Expo application connects to Supabase for authenticated data access and server-side functions. Supabase Edge Functions separate on-demand weekly progress from end-of-week summaries; a documented cron workflow handles scheduled summary generation. On-device caching reduces repeated requests, while Expo SecureStore backs the authentication storage adapter.",
    technologies: [
      {
        title: "Mobile interface",
        text: "React Native and Expo Router organise the dashboard, runs, strength, nutrition and profile screens. NativeWind supplies a shared styling language, with native haptics and notifications supporting the interaction.",
      },
      {
        title: "Data and services",
        text: "Supabase provides the application’s backend boundary. Typed TypeScript modules manage requests, while timestamped AsyncStorage caches keep frequently used data close to the dashboard.",
      },
      {
        title: "Native health integration",
        text: "The iOS HealthKit adapter brings workouts, heart rate and recovery signals into the training context. Access depends on supported devices and the permissions the runner chooses to grant.",
      },
    ],
  },
  {
    id: "local-brain",
    title: "PyrOS",
    tagline: "Your knowledge. Your files.",
    category: "Web · Local-first workspace",
    visual: "brain",
    summary:
      "A private workspace connecting Markdown knowledge, rich editing, reusable templates and project tasks—with your local files as the source of truth.",
    stack: ["React", "TypeScript", "Vite", "Zustand", "Markdown", "Three.js"],
    github: "https://github.com/LidlDev/local-brain",
    site: "https://pyros.lidldev.com",
    images: [],
    problem:
      "Knowledge and tasks should stay useful outside the tool that created them. PyrOS works directly with a selected folder of Markdown files, keeping the workspace close to the source.",
    decisions: [
      {
        title: "Knowledge you can keep",
        text: "Notes remain ordinary Markdown files with YAML metadata. Rich editing, backlinks and linked attachments add useful ways to work with that content while keeping it accessible outside the app.",
      },
      {
        title: "Templates that do more than copy",
        text: "Reusable snippets support typed inputs such as dates, dropdowns and multiline fields. A companion browser extension supports manual capture and snippet insertion, reducing repetitive casework without requiring a remote content store.",
      },
      {
        title: "Notes into action",
        text: "Task lists and Kanban boards derive work from the same notes. Diagnostic guides include local image and PDF attachments; search and graph views help reconnect tasks with the supporting knowledge.",
      },
    ],
    next: "Keep improving editing, navigation and large-workspace performance without compromising the file-based foundation.",
    overview:
      "PyrOS brings the material of everyday knowledge work together: notes, diagnostic guides, snippets, attachments and tasks. The same Markdown files power an editor, search, backlinks, a knowledge graph and task boards, so information can move from something you saved to something you can act on.",
    infrastructure:
      "A React and Vite web build is delivered as static assets through Cloudflare Workers. Content stays in a folder selected through the browser’s File System Access API: Markdown and YAML hold notes, versioned JSON holds workspace settings, and managed files hold attachments. Search and graph data are derived locally; a cloud database is not required for workspace content.",
    technologies: [
      {
        title: "Editing and workspace",
        text: "TipTap and ProseMirror provide formatted editing, while remark and YAML parsing preserve the Markdown foundation. Zustand manages drafts and interface state; FlexLayout supports a dockable workspace.",
      },
      {
        title: "Finding and connecting",
        text: "MiniSearch builds local search indexes. Backlinks, tasks and graph relationships come from the same parsed files; Three.js supports the interactive knowledge graph.",
      },
      {
        title: "Reliable local storage",
        text: "SHA-256 revision checks detect external edits before a save. Serialized file writes and recovery checkpoints protect drafts, while permission-scoped browser handles keep access tied to the selected folder.",
      },
    ],
  },
  {
    id: "Spike",
    title: "Spike!",
    tagline: "Built for the court.",
    category: "Mobile · Volleyball",
    visual: "image",
    summary:
      "A volleyball team workspace bringing rosters, training, match statistics and communication closer to the decisions made on court.",
    stack: ["Swift", "Java", "Firebase"],
    image: "/images/projects/spike/hero.webp",
    images: [
      "/images/projects/spike/stats.webp",
      "/images/projects/spike/training.webp",
    ],
    problem:
      "Volleyball teams need shared context around players, training and matches. Spike! explores how those workflows can fit into a focused mobile application.",
    decisions: [
      {
        title: "A clearer team picture",
        text: "Roster management, attendance and competition views bring player availability and team organisation into one place. Coaches can prepare sessions with the same context players use to stay informed.",
      },
      {
        title: "Tools for match decisions",
        text: "Dedicated lineup, tactics and statistics screens focus on the details that matter during a match. Match tracking and performance records create material for reviewing how a team played.",
      },
      {
        title: "Training beyond the fixture",
        text: "Training schedules, a drill library and team chat connect preparation with communication. The interface work treats coaching and ongoing development as part of the weekly team routine.",
      },
    ],
    next: "Continue exploring a clearer connection between team organisation and on-court tools.",
    overview:
      "Spike! organises the work around a volleyball team, from preparing a training session to choosing a lineup and reviewing a match. The project combines player-facing coordination with coach-facing tools so the same team context can support both organisation and performance discussions.",
    infrastructure:
      "The documented mobile architecture combines Swift for iOS and Java for Android with Firebase services. Cloud Firestore holds shared team and match records, Firebase Auth handles identity, and Cloud Functions, Storage and push notifications support backend events, media and updates.",
    technologies: [
      {
        title: "Native mobile",
        text: "Swift and Java target the two mobile platforms, with Xcode and Android Studio providing the native development environments.",
      },
      {
        title: "Shared team data",
        text: "The original architecture specifies Firestore and Firebase Auth for shared records and signed-in access, keeping team information behind a consistent service boundary.",
      },
      {
        title: "Events and media",
        text: "Firebase Cloud Functions, Storage and push notifications are documented for event-driven features, uploaded media and team updates.",
      },
    ],
    evidence:
      "This earlier project’s architecture is described from its original portfolio documentation and interface work.",
  },
  {
    id: "Pyreus",
    title: "Pyreus",
    tagline: "A place for the process.",
    category: "Web · Developer tools",
    visual: "image",
    summary:
      "An earlier developer workspace bringing project planning, connected knowledge and code experimentation into a shared desktop interface.",
    stack: ["React", "TypeScript", "Electron", "Node.js", "Docker", "Neo4j"],
    image: "/images/projects/pyreus/hero.webp",
    images: [
      "/images/projects/pyreus/screen-02.webp",
      "/images/projects/pyreus/screen-03.webp",
    ],
    problem:
      "Development involves more than code. Pyreus explores bringing planning, knowledge and project context into the same workspace.",
    decisions: [
      {
        title: "Planning beside the work",
        text: "Tasks, notes, calendar context and project views share one shell. The aim was to keep the reasoning behind development work close to the code and experiments it supports.",
      },
      {
        title: "Experimentation with context",
        text: "The documented sandbox and live-preview workflow explores running small code experiments and inspecting their output within a project workspace, with execution separated from the main application.",
      },
      {
        title: "Knowledge as a network",
        text: "Linked notes, a graph and visual planning tools explore the relationships between ideas, projects and decisions. The project’s screenshots preserve that broader workspace approach.",
      },
    ],
    next: "Carry useful interface lessons into more focused, file-based developer tools.",
    overview:
      "Pyreus explored a personal operating system for development work: a place to organise projects, connect notes and experiment with code without losing the surrounding context. Its broad workspace direction informed later work on more focused tools such as PyrOS.",
    infrastructure:
      "The original architecture describes a React and TypeScript interface within an Electron desktop shell, supported by Node.js services. A Neo4j knowledge graph models relationships between notes and projects, while Docker-based execution separates code experiments from the main workspace.",
    technologies: [
      {
        title: "Desktop workspace",
        text: "React and TypeScript shape the interface; Electron packages the desktop shell. Vite, Zustand and React Query are listed in the original development stack.",
      },
      {
        title: "Connected knowledge",
        text: "Neo4j is the documented graph foundation for linked notes and project context. Search and bidirectional links form part of the workspace’s knowledge-management direction.",
      },
      {
        title: "Code and preview tools",
        text: "The design includes Docker sandboxes and browser-driven UI previews using Puppeteer or Playwright. OpenAI and Anthropic APIs are described for the development-assistant direction.",
      },
    ],
    evidence:
      "This case study records the earlier project’s documented architecture and design direction; it is distinct from the current PyrOS app.",
  },
  {
    id: "Uncharted",
    title: "Uncharted",
    tagline: "Curiosity, mapped.",
    category: "Mobile · Exploration",
    visual: "image",
    summary:
      "A mobile discovery project combining nearby places, interactive maps and travel planning to make everyday exploration more intentional.",
    stack: [
      "React Native",
      "TypeScript",
      "Expo",
      "Node.js",
      "PostgreSQL",
      "Google Maps",
    ],
    image: "/images/projects/uncharted/hero.webp",
    images: [],
    problem:
      "Interesting places are easy to pass by. Uncharted explores an experience that encourages curiosity about nearby destinations.",
    decisions: [
      {
        title: "Find a reason to explore",
        text: "Nearby-place discovery and interactive maps put points of interest into their geographical context, helping turn a spare moment or unfamiliar neighbourhood into an exploration.",
      },
      {
        title: "From a place to a plan",
        text: "Saved destinations and itinerary planning organise discoveries into a trip. Offline access to saved places and maps is part of the original feature direction for travelling beyond a reliable connection.",
      },
      {
        title: "Make discovery memorable",
        text: "Achievements track exploration, while sharing and recommendations connect personal discoveries with other travellers. These features give the project a direction beyond a list of locations.",
      },
    ],
    next: "Refine the discovery experience and the connection between places, maps and personal exploration.",
    overview:
      "Uncharted starts with a simple idea: you can be a tourist wherever you are. Location-based discovery, saved places and trip planning bring interesting destinations into reach, while progress and social features give people ways to remember and share their discoveries.",
    infrastructure:
      "The documented architecture uses an Expo and React Native client with a Node.js and Express backend. PostgreSQL stores application records behind REST APIs, while Google Maps, Places and device geolocation supply the map and nearby-discovery layer.",
    technologies: [
      {
        title: "Mobile experience",
        text: "React Native, TypeScript and Expo form the mobile client, with React Navigation organising the discovery and planning flows.",
      },
      {
        title: "Backend services",
        text: "The original stack lists Node.js, Express and PostgreSQL, separating persistent application data from the mobile interface through REST APIs.",
      },
      {
        title: "Maps and discovery",
        text: "Google Maps and Places APIs are documented alongside geolocation for map views, points of interest and nearby-place discovery.",
      },
    ],
    evidence:
      "Infrastructure and feature direction are drawn from the original project description; a current public release is not linked.",
  },
];
