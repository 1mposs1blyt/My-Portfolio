import React from "react";
import { getLocalization } from "../data/localization";

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
  repoUrl?: string | null;
  liveUrl?: string | null;
  stack: string[];
  order: number;
  images: Array<{ url: string; order: number }>;
  reviews?: any[];
}

export type Localization = ReturnType<typeof getLocalization>[LangType];