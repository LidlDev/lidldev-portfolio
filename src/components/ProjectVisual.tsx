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
      <div className="project-art pyros-art">
        <img
          className="pyros-icon"
          src="/images/projects/pyros/icon.svg"
          width="192"
          height="224"
          alt="PyrOS app flame icon"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="pyros-name">
          PyrOS<small>Your knowledge. Your files.</small>
        </span>
        <span className="art-label">A PRIVATE WORKSPACE</span>
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
