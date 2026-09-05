import React from "react";
import { Project } from "../../types/portfolio";
import SectionHeader from "../ui/SectionHeader";
import ProjectCard from "../ProjectCard";
interface ProjectsSectionProps {
  t: any;
  projects: Project[];
  onOpenGallery: (project: Project) => void;
}
export default function ProjectsSection({
  t,
  projects,
  onOpenGallery
}: ProjectsSectionProps) {
  return <section className="b-section" data-section="projects">
      <SectionHeader fileName="projects/" title={t.headings.projects} />
      <div className="b-grid">
        {projects.map(p => <ProjectCard key={p.id} p={p} t={t} onOpen={onOpenGallery} />)}
      </div>
    </section>;
}