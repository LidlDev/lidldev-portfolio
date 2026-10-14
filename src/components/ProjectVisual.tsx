import type { Project } from "../data/projects";
export default function ProjectVisual({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  if (project.visual === "cadence")
    return (
      <div
        className="project-art cadence-art"
        role="img"
        aria-label="Cadence orange brand mark with an abstract running track"
      >
        <div className="track-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <img
          className="cadence-logo"
          src="/images/projects/cadence-mobile/mark.webp"
          width="760"
          height="758"
          alt=""
          loading={priority ? "eager" : "lazy"}
        />
        <span className="art-title">
          cadence<span>Find your rhythm.</span>
        </span>
        <span className="art-label">TRAIN / RECOVER / REPEAT</span>
      </div>
    );
  if (project.visual === "brain")
    return (
      <div
        className="project-art brain-art"
        role="img"
        aria-label="Abstract connected notes illustration for PyrOS"
      >
        <div className="brain-grid" />
        <svg
          className="brain-connections"
          viewBox="0 0 600 380"
          aria-hidden="true"
        >
          <path d="M160 90L310 185L450 85M310 185L450 295M310 185L125 285M160 90L450 85M125 285L450 295" />
        </svg>
        <div className="brain-node node-one">ideas.md</div>
        <div className="brain-node node-two">projects.md</div>
        <div className="brain-core">
          P<span>yr</span>OS<small>Knowledge, connected.</small>
        </div>
        <div className="brain-node node-three">notes.md</div>
        <div className="brain-node node-four">tasks.md</div>
        <span className="art-label">LOCAL FIRST. ALWAYS YOURS.</span>
      </div>
    );
  return (
    <div className={"project-art image-art art-" + project.id.toLowerCase()}>
      <img
        src={project.image}
        width="1600"
        height="1000"
        alt={project.title + " project interface"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}
