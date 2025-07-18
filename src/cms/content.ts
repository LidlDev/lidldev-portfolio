// Content Management System
// This file serves as a simple CMS that can be easily migrated to a headless CMS like Strapi, Contentful, or Sanity

export interface CMSImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

export interface CMSLink {
  text: string;
  url: string;
  external?: boolean;
}

export interface CMSHeroContent {
  greeting: string;
  name: string;
  taglines: string[];
  description: string;
  primaryButton: CMSLink;
  secondaryButton: CMSLink;
  scrollText: string;
}

export interface CMSAboutContent {
  title: string;
  subtitle: string;
  description: string[];
  image: CMSImage;
  stats: {
    icon: string;
    title: string;
    value: string;
  }[];
  githubSection: {
    title: string;
    subtitle: string;
    description: string;
  };
}

export interface CMSSkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export interface CMSSkillsContent {
  title: string;
  subtitle: string;
  description: string;
  categories: CMSSkillCategory[];
  currentFocus: {
    title: string;
    technologies: string[];
  };
}

export interface CMSContactContent {
  title: string;
  subtitle: string;
  description: string;
  contactInfo: {
    email: string;
    location: string;
  };
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
  form: {
    title: string;
    fields: {
      name: string;
      label: string;
      type: string;
      placeholder: string;
      required: boolean;
    }[];
    submitText: string;
    successMessage: string;
    errorMessage: string;
  };
}

export interface CMSProjectContent {
  title: string;
  subtitle: string;
  description: string;
}

export interface CMSSiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  author: string;
  email: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    keywords: string[];
    ogImage: string;
  };
}

// Content data - this would typically come from a headless CMS
export const cmsContent = {
  siteSettings: {
    siteName: "LidlDev Portfolio",
    siteDescription: "Harry Liddle - Full Stack Developer & UI/UX Designer",
    siteUrl: "https://www.lidldev.com",
    author: "Harry Liddle",
    email: "harry@lidldev.com",
    social: {
      github: "https://github.com/LidlDev",
      linkedin: "https://www.linkedin.com/in/harry-liddle-450a1b233/",
      twitter: "https://twitter.com/LidlDev",
      instagram: "https://instagram.com/LidlDev",
    },
    seo: {
      defaultTitle: "Harry Liddle - Full Stack Developer & UI/UX Designer",
      titleTemplate: "%s | LidlDev Portfolio",
      defaultDescription: "Passionate full-stack developer specializing in React, TypeScript, Node.js, and modern web technologies. Creating beautiful, functional applications with exceptional user experiences.",
      keywords: [
        "Harry Liddle",
        "LidlDev",
        "Full Stack Developer",
        "React Developer",
        "TypeScript",
        "Node.js",
        "Web Development",
        "UI/UX Design",
        "Mobile Development",
        "JavaScript",
        "Portfolio",
        "Sydney Developer"
      ],
      ogImage: "https://www.lidldev.com/og-image.jpg",
    },
  } as CMSSiteSettings,

  hero: {
    greeting: "Hello, I'm",
    name: "Harry",
    taglines: [
      "Crafting Digital Experiences",
      "Designing Mobile Interfaces", 
      "Building ML-Powered Solutions",
      "Creating Intuitive UI/UX"
    ],
    description: "I build beautiful, interactive web applications with modern technologies. Turning ideas into exceptional digital experiences.",
    primaryButton: {
      text: "View My Work",
      url: "#projects",
      external: false,
    },
    secondaryButton: {
      text: "Contact Me",
      url: "#contact", 
      external: false,
    },
    scrollText: "Scroll down",
  } as CMSHeroContent,

  about: {
    title: "About Me",
    subtitle: "",
    description: [
      "I'm a passionate developer focused on creating modern, user-friendly web and mobile experiences. With a strong foundation in front-end development and an eye for design, I craft interfaces that are both beautiful and functional.",
      "My journey in tech began with a curiosity about how websites and apps work, which evolved into a career building cutting-edge applications. I love solving complex problems and turning ideas into reality through programming."
    ],
    image: {
      url: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      alt: "Developer working",
    },
    stats: [
      {
        icon: "User",
        title: "Experience", 
        value: "5+ Years"
      },
      {
        icon: "Star",
        title: "Projects",
        value: "20+ Completed"
      },
      {
        icon: "User", 
        title: "Education",
        value: "CS Degree"
      },
      {
        icon: "Star",
        title: "Availability", 
        value: "Open to Work"
      }
    ],
    githubSection: {
      title: "GitHub Activity",
      subtitle: "",
      description: "Here's a look at my coding activity and contributions on GitHub.",
    },
  } as CMSAboutContent,

  skills: {
    title: "My Skills",
    subtitle: "",
    description: "I've worked with a variety of technologies in the web development world. Here's a snapshot of my technical expertise.",
    categories: [
      {
        name: "Frontend Development",
        icon: "Code",
        skills: [
          "React", "Next.js", "TypeScript", "JavaScript",
          "HTML5", "CSS3", "Tailwind CSS", "SASS/SCSS", "SwiftUI"
        ]
      },
      {
        name: "Backend Development", 
        icon: "Code",
        skills: [
          "Node.js", "Express", "MongoDB", "PostgreSQL",
          "API Development", "Authentication", "GraphQL"
        ]
      },
      {
        name: "Tools & Platforms",
        icon: "Code", 
        skills: [
          "Git", "GitHub", "VS Code", "Docker",
          "Webpack", "Vite", "AWS", "Vercel"
        ]
      },
      {
        name: "Design & Other",
        icon: "Code",
        skills: [
          "Figma", "Adobe XD", "Responsive Design", "UI/UX",
          "Accessibility", "Testing", "Performance Optimization"
        ]
      }
    ],
    currentFocus: {
      title: "Current Focus",
      technologies: ["Next.js 14", "Tailwind CSS", "TypeScript", "React Server Components"]
    },
  } as CMSSkillsContent,

  projects: {
    title: "My Projects",
    subtitle: "",
    description: "Explore my recent work and personal projects. Each one represents a unique challenge and learning opportunity.",
  } as CMSProjectContent,

  contact: {
    title: "Get In Touch", 
    subtitle: "",
    description: "Have a project in mind or want to chat? I'm always open to new opportunities and collaborations.",
    contactInfo: {
      email: "harry@lidldev.com",
      location: "Sydney, Australia",
    },
    socialLinks: [
      {
        platform: "GitHub",
        url: "https://github.com/LidlDev",
        icon: "github"
      },
      {
        platform: "Twitter", 
        url: "https://twitter.com/LidlDev",
        icon: "twitter"
      },
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/harry-liddle-450a1b233/",
        icon: "linkedin"
      },
      {
        platform: "Instagram",
        url: "https://instagram.com/LidlDev", 
        icon: "instagram"
      }
    ],
    form: {
      title: "Send Me a Message",
      fields: [
        {
          name: "name",
          label: "Your Name",
          type: "text",
          placeholder: "John Doe",
          required: true,
        },
        {
          name: "email", 
          label: "Your Email",
          type: "email",
          placeholder: "john@example.com",
          required: true,
        },
        {
          name: "subject",
          label: "Subject", 
          type: "text",
          placeholder: "Project Inquiry",
          required: true,
        },
        {
          name: "message",
          label: "Message",
          type: "textarea", 
          placeholder: "How can I help you? Tell me about your project, ideas, or just say hello!",
          required: true,
        }
      ],
      submitText: "Send Message",
      successMessage: "Message sent successfully! I'll get back to you soon.",
      errorMessage: "Failed to send message. Please try again or email me directly.",
    },
  } as CMSContactContent,
};
