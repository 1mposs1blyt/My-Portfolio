import React, { useMemo } from "react";
import { SidebarProps } from "../types/portfolio";
import { profile } from "../data/profile";
import { getLocalization } from "../data/localization"; // 💡 Изменили импорт на функцию

export default function Sidebar({ lang, setLang, active, onNavigate }: SidebarProps) {
  
  // 💡 Динамически получаем нужный язык через хук
  const t = useMemo(() => {
    return getLocalization(profile.projects.length, profile.name, profile.headline)[lang];
  }, [lang]);

  return (
    <aside className="b-side">
      <div className="b-side-id">
        <div className="b-side-name">{profile.name}</div>
        <div className="b-side-role">{profile.headline}</div>
        <div className="b-hire">
          <i />
          {t.hire}
        </div>
      </div>

      <nav className="b-tree">
        {t.tree.map((n) => (
          <button key={n.id} onClick={() => onNavigate(n.id)} data-on={String(active === n.id)}>
            <span>{n.file}</span>
            {n.count ? <span className="b-tree-count">{n.count}</span> : null}
          </button>
        ))}
      </nav>

      <div className="b-side-foot">
        <div className="b-lang">
          <button onClick={() => setLang("ru")} data-on={String(lang === "ru")}>ru</button>
          <button onClick={() => setLang("en")} data-on={String(lang === "en")}>en</button>
        </div>
      </div>
    </aside>
  );
}
