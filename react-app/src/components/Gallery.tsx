import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Project } from "../types/portfolio";
interface GalleryProps {
  project: Project;
  t: any;
  onClose: () => void;
}
export default function Gallery({
  project,
  t,
  onClose
}: GalleryProps) {
  const images = useMemo(() => [...project.images].sort((a, b) => a.order - b.order), [project]);
  const [i, setI] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const go = useCallback((d: number) => setI(v => (v + d + images.length) % images.length), [images.length]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);
  const currentImageUrl = images[i]?.url || "";
  const isMainGeneratedSvg = currentImageUrl.startsWith("data:image/svg+xml,");
  const mainSvgContent = isMainGeneratedSvg ? decodeURIComponent(currentImageUrl.replace("data:image/svg+xml,", "")) : "";
  const rawEnvUrl = import.meta.env.VITE_BACKEND_URL;
  const backendUrl = rawEnvUrl && rawEnvUrl.trim() !== "" ? rawEnvUrl : "http://localhost:3333";
  const fullCoverUrl = currentImageUrl.includes("public") ? `${backendUrl}${currentImageUrl.startsWith("/") ? "" : "/"}${currentImageUrl}` : currentImageUrl;
  return <div className="b-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={project.name}>
      <div className="b-modal-box b-window" ref={boxRef} tabIndex={-1} onClick={e => e.stopPropagation()}>
        <div className="b-window-bar">
          <span className="b-dotbtn" />
          <span className="b-window-title">{project.name}</span>
          <span className="b-modal-count">
            {i + 1} / {images.length}
          </span>
          <button className="b-x" onClick={onClose} aria-label={t.close}>
            ✕
          </button>
        </div>

        {}
        <div className="b-stage">
          {images[i] && (isMainGeneratedSvg ? <div dangerouslySetInnerHTML={{
          __html: mainSvgContent
        }} className="b-svg-stage-wrapper" style={{
          width: "100%",
          height: "100%"
        }} /> : <img src={fullCoverUrl} alt={`${project.name} — ${i + 1}`} />)}
          {images.length > 1 && <>
              <button className="b-nav b-nav-l" onClick={() => go(-1)} aria-label={t.prev}>
                ‹
              </button>
              <button className="b-nav b-nav-r" onClick={() => go(1)} aria-label={t.next}>
                ›
              </button>
            </>}
        </div>

        {}
        {images.length > 1 && <div className="b-thumbs">
            {images.map((img, k) => {
          const isThumbGenerated = img.url.startsWith("data:image/svg+xml,");
          const thumbSvgContent = isThumbGenerated ? decodeURIComponent(img.url.replace("data:image/svg+xml,", "")) : "";
          const thumbUrl = img.url.includes("public") ? `${backendUrl}${img.url.startsWith("/") ? "" : "/"}${img.url}` : img.url;
          return <button key={k} className="b-thumb" data-on={String(k === i)} onClick={() => setI(k)} aria-label={String(k + 1)}>
                  {isThumbGenerated ? <div dangerouslySetInnerHTML={{
              __html: thumbSvgContent
            }} className="b-svg-thumb-wrapper" /> : <img src={thumbUrl} alt="" />}
                </button>;
        })}
          </div>}

        {}
        {project.reviews && project.reviews.length > 0 && <div className="b-project-reviews" style={{
        padding: "1.25rem",
        borderTop: "1px solid #2A2140",
        background: "#161124"
      }}>
            <h4 style={{
          margin: "0 0 1rem 0",
          color: "#FF3DA6",
          fontSize: "1.1rem"
        }}>
              {t.headings?.reviews || "Отзывы заказчиков"}
            </h4>
            <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
              {project.reviews.map((rev: any) => <blockquote key={rev.id} style={{
            margin: 0,
            paddingLeft: "1rem",
            borderLeft: "3px solid #8B5CF6"
          }}>
                  <p style={{
              margin: "0 0 0.5rem 0",
              fontStyle: "italic",
              lineHeight: 1.4
            }}>
                    “{rev.text}”
                  </p>
                  <cite style={{
              fontSize: "0.85rem",
              color: "#7E769A",
              fontStyle: "normal"
            }}>
                    — {rev.authorName} {rev.company ? `(${rev.company})` : ""}
                  </cite>
                </blockquote>)}
            </div>
          </div>}

        <div className="b-modal-foot">
          <p>{project.description}</p>
          <ul className="b-tags">
            {project.stack.map(s => <li key={s}>{s}</li>)}
          </ul>
          <div className="b-actions">
            {project.liveUrl && <a className="b-btn b-btn-main" href={project.liveUrl} target="_blank" rel="noreferrer">
                {t.demo}
              </a>}
            {project.repoUrl && <a className="b-btn" href={project.repoUrl} target="_blank" rel="noreferrer">
                {t.repo}
              </a>}
          </div>
        </div>
      </div>
    </div>;
}