// src/components/PortfolioWorkspace.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
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
  const [open, setOpen] = useState<Project | null>(null);
  const scope = useRef<HTMLDivElement>(null);

  // 🚀 Запрашиваем данные (больше не блокируем рендер компонента)
  const { loading, error, profile } = usePortfolioData();

  // 💡 Локализация теперь ВСЕГДА имеет дефолтные значения (защита от пустой БД или загрузки)
  const t = useMemo(() => {
    const projectsCount = profile?.projects?.length || 0;
    const name = profile?.name || "Александр"; 
    const headline = profile?.headline || "Разработчик";
    return getLocalization(projectsCount, name, headline)[lang];
  }, [lang, profile]);

  // Мемоизация упорядоченных данных (безопасно возвращают пустые массивы при загрузке)
  const projects = useMemo(
    () => profile?.projects ? [...profile.projects].sort((a, b) => a.order - b.order) : [],
    [profile?.projects],
  );

  const links = useMemo(
    () => profile?.links ? [...profile.links].sort((a, b) => a.order - b.order) : [],
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
    () => profile?.experience ? [...profile.experience].sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return dateB - dateA;
          }) : [],
    [profile?.experience],
  );

  // Следим за тем, какая секция сейчас на экране
  useEffect(() => {
    const root = scope.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const sections = Array.from(root.querySelectorAll("[data-section]"));
    const io = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topVisible = visibleEntries[0];
        if (topVisible) {
          setActive(topVisible.target.getAttribute("data-section") || "about");
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleNavigate = (id: string) => {
    scope.current
      ?.querySelector(`[data-section="${id}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="b-root" ref={scope}>
      {/* 💡 Сайдбар рендерится СРАЗУ, переключалка языков доступна мгновенно */}
      <Sidebar
        lang={lang}
        setLang={setLang}
        active={active}
        onNavigate={handleNavigate}
      />

      <main className="b-main">
        {/* Терминал запускается сразу при старте страницы */}
        <TerminalPane lang={lang} />
        
        {/* Контентные секции плавно рендарят пустые состояния или скелетоны, если данных еще нет */}
        <AboutSection t={t} />
        
        {/* Если база данных легла, внутри секции можно будет вывести красивый варн */}
        <ProjectsSection t={t} projects={projects} onOpenGallery={setOpen} />
        
        <SkillsSection t={t} skills={skills} />
        
        <ExperienceSection t={t} experience={experience} />
        
        <ContactsSection t={t} links={links} />

        {/* Локальное уведомление об ошибке b-node, не ломающее весь сайт */}
        {error && <div className="b-error-toast">Связь с NestJS потеряна: {error}</div>}
      </main>

      {open && <Gallery project={open} t={t} onClose={() => setOpen(null)} />}
    </div>
  );
}
