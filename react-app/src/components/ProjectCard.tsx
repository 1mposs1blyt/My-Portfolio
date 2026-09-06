import React from "react";
import { Project } from "../types/portfolio";
import { imageSrc } from "../utils/helpers";
interface ProjectCardProps {
  p: Project;
  t: any;
  onOpen: (project: Project) => void;
}
export default function ProjectCard({
  p,
  t,
  onOpen
}: ProjectCardProps) {
  const has = p.images.length > 0;
  const coverUrl = has ? [...p.images].sort((a, b) => a.order - b.order)[0].url : "";
  const isGeneratedSvg = coverUrl.startsWith("data:image/svg+xml,");
  const rawSvgContent = isGeneratedSvg ? decodeURIComponent(coverUrl.replace("data:image/svg+xml,", "")) : "";
  const rawEnvUrl = import.meta.env.VITE_BACKEND_URL;
  const backendUrl = rawEnvUrl && rawEnvUrl.trim() !== "" ? rawEnvUrl : "http://localhost:3333";
  const fullCoverUrl = coverUrl.includes("public") ? `${backendUrl}${coverUrl.startsWith("/") ? "" : "/"}${coverUrl}` : coverUrl;
  return <article className="b-window b-card">
      <div className="b-window-bar">
        <span className="b-window-file">{p.name}</span>
        <span className="b-count">
          {has ? t.shots(p.images.length) : t.noShots}
        </span>
      </div>

      {has ? <button className="b-cover" onClick={() => onOpen(p)} aria-label={`${t.gallery} — ${p.name}`}>
          {isGeneratedSvg ? <div dangerouslySetInnerHTML={{
        __html: rawSvgContent
      }} className="b-svg-wrapper" /> : <img src={imageSrc(p.images[0].url)} alt={`${p.name} — 1`} />}
          {p.images.length > 1 && <span className="b-stackmark">+{p.images.length - 1}</span>}
        </button> : <div className="b-cover b-cover-empty">
          <span>{t.noShots}</span>
        </div>}

      <div className="b-card-body">
        <p className="b-desc">{p.description}</p>
        <ul className="b-tags">
          {p.stack.map(s => <li key={s}>{s}</li>)}
        </ul>
        <div className="b-actions">
          {p.liveUrl ? <a className="b-btn b-btn-main" href={p.liveUrl} target="_blank" rel="noreferrer">
              {t.demo}
            </a> : has && <button className="b-btn b-btn-main" onClick={() => onOpen(p)}>
                {t.gallery}
              </button>}
          {p.repoUrl && <a className="b-btn" href={p.repoUrl} target="_blank" rel="noreferrer">
              {t.repo}
            </a>}
        </div>
      </div>
    </article>;
}