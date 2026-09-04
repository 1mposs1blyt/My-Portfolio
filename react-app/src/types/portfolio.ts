import React from "react";
export type LangType = "ru" | "en";

export interface SidebarProps {
  lang: LangType;
  setLang: React.Dispatch<React.SetStateAction<LangType>>;
  active: string;
  onNavigate: (id: string) => void;
}

export interface ProjectImage {
  url: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  liveUrl: string | null;
  stack: string[];
  order: number;
  images: ProjectImage[];
}

// При необходимости добавьте интерфейсы для Profile, Skill, Experience
