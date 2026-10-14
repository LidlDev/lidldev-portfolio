import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
} from "lucide-react";
import { ThemeProvider } from "./components/Theme";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import SEO from "./components/SEO";
import Sculpture from "./components/Sculpture";
import ProjectVisual from "./components/ProjectVisual";
import { projects, type Project } from "./data/projects";
const SpikePrivacy = lazy(() => import("./pages/SpikePrivacyPolicy"));
const SpikeTerms = lazy(() => import("./pages/SpikeTermsOfService"));
const External = ({
  href,
  children,
  className = "text-link",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <a className={className} href={href} target="_blank" rel="noreferrer">
    {children} <ArrowUpRight size={17} />
  </a>
);
function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        const section = document.getElementById(location.hash.slice(1));
        section?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
        section?.focus({ preventScroll: true });
      } else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.pathname, location.hash]);
  return null;
}
function Contact() {
  return (
    <section className="contact-section section" id="contact" tabIndex={-1}>
      <div className="section-label">
        <span>04 / GET IN TOUCH</span>
        <span>GOOD THINGS START WITH A CONVERSATION</span>
      </div>
      <div className="contact-content">
        <h2>
          Have an idea?
          <br />
          <span>Let’s make it real.</span>
        </h2>
        <a
          className="contact-orbit"
          href="mailto:harry@lidldev.com"
          aria-label="Email Harry"
        >
          <ArrowUpRight strokeWidth={1.2} />
        </a>
      </div>
      <div className="contact-links">
        <a href="mailto:harry@lidldev.com">
          harry@lidldev.com <ArrowUpRight size={18} />
        </a>
        <External href="https://github.com/LidlDev">Find me on GitHub</External>
      </div>
    </section>
  );
}
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={"project-card project-card-" + index}>
      <Link
        className="project-image-link"
        to={"/project/" + project.id}
        aria-label={"Explore " + project.title}
      >
        <ProjectVisual project={project} />
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={25} />
        </span>
      </Link>
      <div className="project-card-meta">
        <div>
          <span className="eyebrow">
            0{index + 1} / {project.category}
          </span>
          <h3>
            <Link to={"/project/" + project.id}>
              {project.title}
              <ArrowUpRight size={25} />
            </Link>
          </h3>
          <p>{project.summary}</p>
        </div>
        <div className="project-tags">
          {project.stack.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
function Skills() {
  const groups = [
    {
      title: "Interfaces & interaction",
      description:
        "Fluid layouts, accessible controls and motion that supports the experience.",
      items: ["React", "TypeScript", "CSS / Tailwind", "Three.js"],
    },
    {
      title: "Mobile experiences",
      description:
        "Native-aware apps that connect everyday workflows with device capabilities.",
      items: ["React Native", "Expo", "Swift", "Java", "HealthKit"],
    },
    {
      title: "Data & infrastructure",
      description:
        "Choosing the right foundation: shared cloud services or files that stay with their owner.",
      items: [
        "Supabase",
        "Firebase",
        "Cloudflare Workers",
        "Markdown / YAML",
        "File System Access",
      ],
    },
    {
      title: "Building & delivery",
      description:
        "Repeatable builds and browser checks, with careful attention to performance and data integrity.",
      items: [
        "Git / GitHub",
        "Vite",
        "Zustand",
        "Playwright",
        "Accessibility checks",
      ],
    },
  ];
  return (
    <section
      className="skills-section section"
      id="skills"
      tabIndex={-1}
      aria-labelledby="skills-heading"
    >
      <div className="section-label">
        <span>03 / SKILLS & PRACTICE</span>
        <span>THE TOOLS BEHIND THE WORK</span>
      </div>
      <div className="section-heading">
        <h2 id="skills-heading">
          A practical toolkit.
          <br />
          <span>A thoughtful approach.</span>
        </h2>
        <p>
          Technologies I work with across these projects, and the ways I bring
          them together.
        </p>
      </div>
      <div className="skills-grid">
        {groups.map((group, index) => (
          <article className="skill-group" key={group.title}>
            <span className="eyebrow">0{index + 1}</span>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
function Home() {
  return (
    <>
      <SEO
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Harry",
          alternateName: "LidlDev",
          url: "https://portfolio.lidldev.com",
          sameAs: ["https://github.com/LidlDev"],
        }}
      />
      <NavigationBar />
      <main id="main-content" tabIndex={-1}>
        <section className="hero section" id="top">
          <div className="hero-topline">
            <span className="eyebrow">HARRY / DEVELOPER & MAKER</span>
            <span className="hero-location">
              SYDNEY, AUSTRALIA <i />
            </span>
          </div>
          <div className="hero-composition">
            <div className="hero-copy">
              <h1>
                Small ideas.
                <br />
                <span>Real things.</span>
              </h1>
              <p>
                I build mobile experiences, local-first tools, and the ideas I
                can’t leave alone.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" to="/#work">
                  Explore my work <ArrowDown size={18} />
                </Link>
                <a
                  className="hero-github"
                  href="https://github.com/LidlDev"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LidlDev on GitHub"
                >
                  <Github size={22} />
                </a>
              </div>
            </div>
            <Sculpture />
          </div>
          <div className="hero-bottom">
            <span>PERSONAL PROJECTS. BUILT WITH INTENT.</span>
            <Link to="/#work">
              SCROLL TO DISCOVER <ArrowDown size={14} />
            </Link>
          </div>
        </section>
        <section className="work-section section" id="work" tabIndex={-1}>
          <div className="section-label">
            <span>01 / SELECTED WORK</span>
            <span>A FEW IDEAS, BROUGHT TO LIFE</span>
          </div>
          <div className="section-heading">
            <h2>
              Things I’ve
              <br />
              <span>been building.</span>
            </h2>
            <p>
              From a runner’s next kilometre to a thought worth keeping. A
              collection of personal projects, experiments and ongoing work.
            </p>
          </div>
          <div className="projects-grid">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
          <div className="project-index">
            <div className="index-label">MORE EXPLORATIONS</div>
            {projects.slice(3).map((project, i) => (
              <Link
                key={project.id}
                to={"/project/" + project.id}
                className="index-row"
              >
                <span className="index-number">0{i + 4}</span>
                <strong>{project.title}</strong>
                <span className="index-category">{project.category}</span>
                <ArrowUpRight size={25} />
              </Link>
            ))}
          </div>
        </section>
        <section className="about-section section" id="about" tabIndex={-1}>
          <div className="section-label">
            <span>02 / A LITTLE ABOUT ME</span>
            <span>THE PERSON BEHIND THE PROJECTS</span>
          </div>
          <div className="about-grid">
            <div>
              <h2>
                Curiosity is my
                <br />
                <span>starting point.</span>
              </h2>
              <div className="about-portrait">
                <img
                  src="/harry-profile.webp"
                  width="240"
                  height="240"
                  loading="lazy"
                  alt="Harry, the developer behind LidlDev"
                />
                <span>
                  HARRY
                  <br />
                  <small>AKA LIDLDEV</small>
                </span>
              </div>
            </div>
            <div className="about-copy">
              <p className="about-lead">
                I’m Harry, a developer in Sydney who enjoys turning a useful
                idea into something you can actually use.
              </p>
              <p>
                I’m interested in the space where thoughtful interfaces meet
                practical engineering. Mobile apps that fit into a day. Tools
                that keep your knowledge close. Small details that make a
                product feel considered.
              </p>
              <p>
                This is a home for that work: the things I’m exploring, what I’m
                learning, and what I’m building along the way.
              </p>
              <div className="practice-list">
                <span>MOBILE EXPERIENCES</span>
                <span>LOCAL-FIRST TOOLS</span>
                <span>INTERFACE & INTERACTION</span>
              </div>
            </div>
          </div>
        </section>
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
function ProjectPage() {
  const { projectId } = useParams();
  const project = projects.find(
    (p) =>
      p.id === projectId || p.id.toLowerCase() === projectId?.toLowerCase(),
  );
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <SEO
        title={project.title + " — " + project.tagline}
        description={project.summary}
        url={"https://portfolio.lidldev.com/project/" + project.id}
      />
      <NavigationBar />
      <main id="main-content" className="case-study section" tabIndex={-1}>
        <Link className="back-link" to="/#work">
          <ArrowLeft size={17} /> All projects
        </Link>
        <div className="case-heading">
          <span className="eyebrow">{project.category}</span>
          <h1>
            {project.title}
            <span>.</span>
          </h1>
          <p>{project.tagline}</p>
        </div>
        <div className="case-meta">
          <div>
            <span>FOCUS</span>
            <strong>{project.summary}</strong>
          </div>
          <div>
            <span>BUILT WITH</span>
            <strong>{project.stack.join(" / ")}</strong>
          </div>
          <div className="case-actions">
            {project.github && (
              <External href={project.github}>View repository</External>
            )}
            {project.site && (
              <External href={project.site}>Explore PyrOS</External>
            )}
          </div>
        </div>
        <ProjectVisual project={project} priority />
        {project.visual !== "image" && (
          <p className="visual-caption">
            {project.visual === "cadence"
              ? "Cadence brand exploration using the project’s original mark."
              : "The original PyrOS flame mark used by the app and favicon."}
          </p>
        )}
        <div className="case-intro">
          <span className="eyebrow">THE IDEA</span>
          <div>
            <h2>{project.problem}</h2>
            <p>{project.overview}</p>
          </div>
        </div>
        <section
          className="case-architecture"
          aria-labelledby="architecture-heading"
        >
          <div className="architecture-heading">
            <span className="eyebrow">UNDER THE HOOD</span>
            <h2 id="architecture-heading">Infrastructure & technology</h2>
            <p>{project.infrastructure}</p>
          </div>
          <div className="technology-grid">
            {project.technologies.map((technology) => (
              <article key={technology.title}>
                <h3>{technology.title}</h3>
                <p>{technology.text}</p>
              </article>
            ))}
          </div>
          {project.evidence && (
            <p className="project-evidence">{project.evidence}</p>
          )}
        </section>
        <div className="case-feature-heading">
          <span className="eyebrow">WHAT IT MAKES POSSIBLE</span>
          <h2>Features with a purpose</h2>
        </div>
        <div className="case-decisions">
          {project.decisions.map((decision, i) => (
            <article key={decision.title}>
              <span className="eyebrow">0{i + 1} / THE FEATURES</span>
              <h3>{decision.title}</h3>
              <p>{decision.text}</p>
            </article>
          ))}
        </div>
        {project.images.length > 0 && (
          <section
            className="case-gallery"
            aria-label={project.title + " image gallery"}
          >
            {project.images.map((image, i) => (
              <figure key={image}>
                <img
                  src={image}
                  width="1400"
                  height="900"
                  loading="lazy"
                  alt={project.title + " interface exploration " + (i + 1)}
                />
                <figcaption>
                  0{i + 1} / {project.title} interface
                </figcaption>
              </figure>
            ))}
          </section>
        )}
        <div className="case-next-step">
          <span className="eyebrow">LOOKING AHEAD</span>
          <p>{project.next}</p>
        </div>
        {project.id === "Spike" && (
          <div className="policy-links">
            <Link to="/spike/privacy-policy">Spike! privacy policy</Link>
            <Link to="/spike/terms-of-service">Spike! terms of service</Link>
          </div>
        )}
        <Link className="next-project" to={"/project/" + next.id}>
          <span>
            <small>UP NEXT</small>
            {next.title}
          </span>
          <ArrowRight size={50} />
        </Link>
      </main>
      <Footer />
    </>
  );
}
function InfoPage({
  kind,
}: {
  kind: "support" | "privacy" | "terms" | "retired";
}) {
  const content = {
    support: {
      title: "A little help.",
      intro: "Questions about a project, or something not working as expected?",
      sections: [
        {
          title: "Get in touch",
          text: "Email harry@lidldev.com with the project name, the device or browser you use, and a description of what happened. Please leave out passwords and personal health or financial information.",
        },
        {
          title: "Project-specific information",
          text: "Spike! has its own privacy policy and terms. Source repositories for the other projects are linked from their case studies.",
        },
      ],
    },
    privacy: {
      title: "Privacy, simply.",
      intro:
        "This page describes the rebuilt portfolio website. Individual projects have their own behavior and policies.",
      sections: [
        {
          title: "Your theme preference",
          text: "The portfolio stores your chosen light, dark or system theme in your browser. No account is needed. This build does not include analytics, email scanning or a cloud database.",
        },
        {
          title: "Contact and external links",
          text: "The email link opens your email application. GitHub and project links lead to external sites governed by their own policies. The website is hosted on Cloudflare Pages, which processes requests to deliver the site.",
        },
        {
          title: "Project policies",
          text: "The existing Spike! privacy policy remains available separately. For questions about this portfolio, contact harry@lidldev.com.",
        },
      ],
    },
    terms: {
      title: "About this site.",
      intro:
        "A personal portfolio of projects, experiments and work in progress.",
      sections: [
        {
          title: "Project information",
          text: "Descriptions and visual work are provided to explain the projects. A repository link is not a promise that an application is publicly released or that every integration is available on every device.",
        },
        {
          title: "Using project code",
          text: "Consult each repository’s license and documentation before reusing code or assets. Project-specific terms, including Spike!’s terms, remain separate from this portfolio.",
        },
        {
          title: "Contact",
          text: "Questions about the work or this website can be sent to harry@lidldev.com.",
        },
      ],
    },
    retired: {
      title: "A simpler direction.",
      intro:
        "The built-in Agent dashboard has been retired from this portfolio.",
      sections: [
        {
          title: "Explore the work instead",
          text: "This site now focuses on project case studies. It no longer provides Agent sign-in, personal data management or email scanning.",
        },
      ],
    },
  }[kind];
  return (
    <>
      <SEO
        title={content.title}
        description={content.intro}
        url={
          "https://portfolio.lidldev.com/" +
          (kind === "retired" ? "agent" : kind)
        }
      />
      <NavigationBar />
      <main id="main-content" className="info-page section" tabIndex={-1}>
        <Link className="back-link" to="/">
          <ArrowLeft size={17} /> Back home
        </Link>
        <span className="eyebrow">
          LIDLDEV / {kind === "retired" ? "PROJECT UPDATE" : kind.toUpperCase()}
        </span>
        <h1>{content.title}</h1>
        <p className="info-intro">{content.intro}</p>
        {content.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
        <div className="policy-links">
          <a href="mailto:harry@lidldev.com">Email Harry ↗</a>
          <Link to="/spike/privacy-policy">Spike! privacy</Link>
          <Link to="/spike/terms-of-service">Spike! terms</Link>
        </div>
        <Link className="button button-primary" to="/#work">
          Explore the projects <ArrowRight size={18} />
        </Link>
      </main>
      <Footer />
    </>
  );
}
function NotFound() {
  return (
    <>
      <SEO title="Page not found" />
      <NavigationBar />
      <main id="main-content" className="info-page section" tabIndex={-1}>
        <span className="eyebrow">404 / A WRONG TURN</span>
        <h1>
          Nothing here.
          <br />
          <span>Plenty to explore.</span>
        </h1>
        <p className="info-intro">
          This page may have moved. Find your way back to the work.
        </p>
        <Link className="button button-primary" to="/#work">
          Explore projects <ArrowRight size={18} />
        </Link>
      </main>
      <Footer />
    </>
  );
}
export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <ScrollManager />
          <Suspense
            fallback={
              <main id="main-content" className="info-page section">
                <p role="status">Loading page…</p>
              </main>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="/agent" element={<InfoPage kind="retired" />} />
              <Route path="/support" element={<InfoPage kind="support" />} />
              <Route path="/privacy" element={<InfoPage kind="privacy" />} />
              <Route path="/terms" element={<InfoPage kind="terms" />} />
              <Route path="/spike/privacy-policy" element={<SpikePrivacy />} />
              <Route path="/spike/terms-of-service" element={<SpikeTerms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
