import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { LangType, Project } from "../types/portfolio";
import { getLocalization } from "../data/localization";
import { usePortfolioData } from "../hooks/usePortfolioData";
import Sidebar from "./Sidebar";
import TerminalPane from "./TerminalPane";
import Gallery from "./Gallery";
import AboutSection from "./sections/AboutSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ContactsSection from "./sections/ContactsSection";
import ReviewsSection from "./sections/ReviewsSection";
const CATEGORY_ORDER = [
  "LANGUAGE",
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "INFRA",
  "TOOL",
];
export default function PortfolioWorkspace() {
  const [lang, setLang] = useState<LangType>("ru");
  const [active, setActive] = useState("about");
  const [available, setAvailable] = useState<string[]>([]);
  const [open, setOpen] = useState<Project | null>(null);
  const scope = useRef<HTMLDivElement>(null);
  const { loading, error, profile, reviews } = usePortfolioData(lang);

  const t = useMemo(() => {
    const projectsCount = profile?.projects?.length || 0;
    const reviewsCount = reviews?.length || 0;
    const name = profile?.name || (lang === "ru" ? "Александр" : "Alexander");
    const headline =
      profile?.headline || (lang === "ru" ? "Разработчик" : "Developer");
    return getLocalization(projectsCount, name, headline, reviewsCount)[lang];
  }, [lang, profile, reviews]);
  const projects = useMemo(() => {
    if (!profile?.projects) return [];
    return [...profile.projects]
      .sort((a, b) => a.order - b.order)
      .map((project) => ({
        ...project,
        reviews: (reviews || []).filter(
          (r: any) => r.type === "CLIENT" && r.projectId === project.id,
        ),
      }));
  }, [profile?.projects, reviews]);
  const allReviews = useMemo(() => {
    if (!reviews) return [];
    return [...reviews].sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [reviews]);
  const links = useMemo(
    () =>
      profile?.links
        ? [...profile.links].sort((a, b) => a.order - b.order)
        : [],
    [profile?.links],
  );
  const skills = useMemo(() => {
    if (!profile?.skills) return [];
    const by: Record<string, any[]> = {};
    profile.skills.forEach((s: any) => {
      (by[s.category] ||= []).push(s);
    });
    Object.values(by).forEach((arr) => arr.sort((a, b) => a.order - b.order));
    return CATEGORY_ORDER.filter((c) => by[c]).map((c) => ({
      category: c,
      items: by[c],
    }));
  }, [profile?.skills]);
  const experience = useMemo(
    () =>
      profile?.experience
        ? [...profile.experience].sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return dateB - dateA;
          })
        : [],
    [profile?.experience],
  );
  const recalc = useCallback(() => {
    const root = scope.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll("[data-section]"));
    if (sections.length === 0) return;
    const ids = sections.map((s) => s.getAttribute("data-section") || "");
    setAvailable((prev) =>
      prev.length === ids.length && prev.every((v, i) => v === ids[i])
        ? prev
        : ids,
    );
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 50;
    if (atBottom) {
      setActive(ids[ids.length - 1]);
      return;
    }
    const triggerLine = window.innerHeight * 0.25;
    let current = ids[0];
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= triggerLine) current = ids[i];
    });
    setActive(current);
  }, []);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        recalc();
      });
    };
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    window.addEventListener("resize", onScroll);
    const root = scope.current;
    const mo = root ? new MutationObserver(onScroll) : null;
    mo?.observe(root!, {
      childList: true,
      subtree: true,
    });
    recalc();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mo?.disconnect();
    };
  }, [recalc, loading, projects, allReviews, skills, experience, links]);
  const handleNavigate = (id: string) => {
    const el = scope.current?.querySelector(`[data-section="${id}"]`);
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActive(id);
  };
  return (
    <div className="b-root" ref={scope}>
      <Sidebar
        lang={lang}
        setLang={setLang}
        active={active}
        onNavigate={handleNavigate}
        t={t}
        name={profile?.name || "Александр"}
        headline={profile?.headline || "Разработчик"}
        available={available}
      />

      <main className="b-main">
        <TerminalPane lang={lang} t={t} />

        <AboutSection t={t} profile={profile} />
        <ProjectsSection t={t} projects={projects} onOpenGallery={setOpen} />
        <ReviewsSection t={t} reviews={allReviews} />
        <SkillsSection t={t} skills={skills} />
        <ExperienceSection t={t} experience={experience} />
        <ContactsSection t={t} links={links} />

        {error && (
          <div className="b-error-toast">Связь с NestJS потеряна: {error}</div>
        )}
      </main>

      {open && <Gallery project={open} t={t} onClose={() => setOpen(null)} />}
    </div>
  );
}
