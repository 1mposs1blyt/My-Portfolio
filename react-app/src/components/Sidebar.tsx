// src/components/Sidebar.tsx
import React from "react";
import { LangType } from "../types/portfolio";

/**
 * Sidebar больше не знает ни про profile, ни про getLocalization.
 * Единственный источник правды — PortfolioWorkspace: он считает t по живым
 * данным из usePortfolioData и передаёт сюда готовым.
 *
 * В types/portfolio.ts у SidebarProps надо добавить:
 *   t: Localization;        // тот же тип, что возвращает getLocalization(...)[lang]
 *   name: string;
 *   headline: string;
 *   available?: string[];   // id секций, реально отрисованных на странице
 */
type SidebarProps = {
  lang: LangType;
  setLang: (lang: LangType) => void;
  active: string;
  onNavigate: (id: string) => void;
  t: any;
  name: string;
  headline: string;
  available?: string[];
};

export default function Sidebar({
  lang,
  setLang,
  active,
  onNavigate,
  t,
  name,
  headline,
  available,
}: SidebarProps) {
  // Если родитель сказал, какие секции есть в DOM, — прячем пункты без секции,
  // чтобы по ним нельзя было кликнуть в пустоту. Без available показываем всё.
  const items = available
    ? t.tree.filter((n: any) => available.includes(n.id))
    : t.tree;

  return (
    <aside className="b-side">
      <div className="b-side-id">
        <div className="b-side-name">{name}</div>
        <div className="b-side-role">{headline}</div>
        <div className="b-hire">
          <i />
          {t.hire}
        </div>
      </div>

      <nav className="b-tree">
        {items.map((n: any) => {
          const on = active === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
              data-on={String(on)}
              aria-current={on ? "true" : undefined}
            >
              <span>{n.file}</span>
              {typeof n.count === "number" && n.count > 0 ? (
                <span className="b-tree-count">{n.count}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="b-side-foot">
        <div className="b-lang">
          <button onClick={() => setLang("ru")} data-on={String(lang === "ru")}>
            ru
          </button>
          <button onClick={() => setLang("en")} data-on={String(lang === "en")}>
            en
          </button>
        </div>
      </div>
    </aside>
  );
}