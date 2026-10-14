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
      "A running companion that brings training, recovery, strength and nutrition into one place.",
    stack: ["React Native", "Expo", "TypeScript", "Supabase"],
    github: "https://github.com/LidlDev/cadence-mobile",
    images: [],
    problem:
      "Training data lives across workouts, calendars and health records. Cadence brings those parts into a mobile experience built around the runner’s week.",
    decisions: [
      {
        title: "A view of the whole week",
        text: "The dashboard combines planned and completed mileage, upcoming runs, personal bests and weekly summaries. Dedicated tabs give runs, strength and nutrition their own space.",
      },
      {
        title: "Making performance useful",
        text: "A VDOT calculation translates recorded race performances into pace and race predictions. Cached queries support the dashboard, with notifications for changes in performance.",
      },
      {
        title: "Health data with boundaries",
        text: "The iOS HealthKit integration covers workouts, heart rate, sleep and recovery. Native health features depend on device support and the runner granting permission.",
      },
    ],
    next: "Continue refining the connections between training, recovery and the daily mobile experience.",
  },
  {
    id: "local-brain",
    title: "PyrOS",
    tagline: "Your knowledge. Your files.",
    category: "Web · Local-first workspace",
    visual: "brain",
    summary:
      "A local-first workspace for Markdown knowledge, reusable snippets and project tasks.",
    stack: ["React", "TypeScript", "Markdown", "File System Access"],
    github: "https://github.com/LidlDev/local-brain",
    site: "https://pyros.lidldev.com",
    images: [],
    problem:
      "Knowledge and tasks should stay useful outside the tool that created them. PyrOS works directly with a selected folder of Markdown files, keeping the workspace close to the source.",
    decisions: [
      {
        title: "Files as the foundation",
        text: "The browser’s File System Access API reads and writes a selected folder. Notes remain Markdown, settings use versioned JSON, and saves check revisions to detect external edits.",
      },
      {
        title: "One source, several perspectives",
        text: "Search, backlinks, graph relationships, templates and task boards are derived from the same files. A browser extension adds manual capture and reusable snippets.",
      },
      {
        title: "A deliberate local workflow",
        text: "No cloud database is required for the web app. Desktop Edge and Chrome support local-folder access; an in-memory sample workspace makes the experience explorable without choosing a folder.",
      },
    ],
    next: "Keep improving editing, navigation and large-workspace performance without compromising the file-based foundation.",
  },
  {
    id: "Spike",
    title: "Spike!",
    tagline: "Built for the court.",
    category: "Mobile · Volleyball",
    visual: "image",
    summary:
      "A volleyball project exploring team coordination, coaching and match statistics.",
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
        title: "A team-oriented experience",
        text: "The project’s screens span team information, training, competitions and communication, with the sport guiding the structure.",
      },
      {
        title: "Tools for the sidelines",
        text: "Coaching, lineups and statistics have dedicated views, bringing the details of a match closer to the decisions made on court.",
      },
      {
        title: "A mobile foundation",
        text: "The existing project uses Swift, Java and Firebase. The gallery shows design and interface work from the project.",
      },
    ],
    next: "Continue exploring a clearer connection between team organisation and on-court tools.",
  },
  {
    id: "Pyreus",
    title: "Pyreus",
    tagline: "A place for the process.",
    category: "Web · Developer tools",
    visual: "image",
    summary:
      "An earlier developer workspace exploring projects, notes and productivity in a unified interface.",
    stack: ["React", "TypeScript", "Developer tooling"],

    image: "/images/projects/pyreus/hero.webp",
    images: [
      "/images/projects/pyreus/screen-02.webp",
      "/images/projects/pyreus/screen-03.webp",
    ],
    problem:
      "Development involves more than code. Pyreus explores bringing planning, knowledge and project context into the same workspace.",
    decisions: [
      {
        title: "A shared workspace",
        text: "The interface work brings multiple development activities into a consistent shell, with project context close to the working area.",
      },
      {
        title: "Exploring connected tools",
        text: "The project studies how notes, planning and developer-focused tools can coexist without scattering context across separate interfaces.",
      },
      {
        title: "An evolving direction",
        text: "This case study preserves earlier project work. PyrOS is a separate, newer local-first workspace with its own repository and approach.",
      },
    ],
    next: "Carry useful interface lessons into more focused, file-based developer tools.",
  },
  {
    id: "Uncharted",
    title: "Uncharted",
    tagline: "Curiosity, mapped.",
    category: "Mobile · Exploration",
    visual: "image",
    summary:
      "A travel discovery project about finding places and exploring the world around you.",
    stack: ["React Native", "TypeScript", "Location services"],

    image: "/images/projects/uncharted/hero.webp",
    images: [],
    problem:
      "Interesting places are easy to pass by. Uncharted explores an experience that encourages curiosity about nearby destinations.",
    decisions: [
      {
        title: "Discovery comes first",
        text: "The project’s direction centres on nearby places and exploration, using location as the starting point for discovery.",
      },
      {
        title: "Designed to travel",
        text: "A mobile interface keeps the experience close to the places being explored.",
      },
      {
        title: "A personal exploration",
        text: "This portfolio entry presents the existing project direction and visual work. Public release links are omitted until there is a confirmed destination.",
      },
    ],
    next: "Refine the discovery experience and the connection between places, maps and personal exploration.",
  },
];
