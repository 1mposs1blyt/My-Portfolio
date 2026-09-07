import React, { useState } from "react";
import { useAdminToken } from "./hooks/useAdminToken";
import { useAdminLang } from "./AdminLangContext";

type Section = {
  id: string;
  label: string;
};
const SECTIONS: Section[] = [
  {
    id: "profile",
    label: "Профиль",
  },
  {
    id: "skills",
    label: "Навыки",
  },
  {
    id: "links",
    label: "Контакты",
  },
  {
    id: "experience",
    label: "Опыт",
  },
  {
    id: "projects",
    label: "Проекты",
  },
  {
    id: "reviews",
    label: "Отзывы",
  },
];
type AdminShellProps = {
  active: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
};
export default function AdminShell({
  active,
  onNavigate,
  children,
}: AdminShellProps) {
  const { lang, setLang } = useAdminLang();
  const { token, setToken, isEditor } = useAdminToken();
  const [draft, setDraft] = useState("");
  const apply = () => {
    setToken(draft.trim());
    setDraft("");
  };
  return (
    <div className="adm-root">
      {!isEditor && (
        <div className="adm-banner">
          <span>
            Демо-режим. Изменения видите только вы, при перезагрузке страницы
            всё вернётся.
          </span>
          <a
            href="https://github.com/1mposs1blyt"
            target="_blank"
            rel="noreferrer"
          >
            исходники
          </a>
        </div>
      )}

      <div className="adm-body">
        <aside className="adm-side">
          <div className="adm-side-title">
            <div>Admin</div>
            <div className="b-lang" style={{ position: "static" }}>
              <button
                type="button"
                onClick={() => setLang("RU")}
                data-on={String(lang === "RU")}
              >
                ru
              </button>
              <button
                type="button"
                onClick={() => setLang("EN")}
                data-on={String(lang === "EN")}
              >
                en
              </button>
            </div>
          </div>

          <nav className="adm-nav">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                data-on={String(active === s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="adm-token">
            {isEditor ? (
              <>
                <div className="adm-token-on">режим записи</div>
                <button className="adm-btn" onClick={() => setToken("")}>
                  выйти
                </button>
              </>
            ) : (
              <>
                <label htmlFor="adm-token-input">токен</label>
                <input
                  id="adm-token-input"
                  type="password"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && apply()}
                  placeholder="вставь и нажми Enter"
                  autoComplete="off"
                />
                <button
                  className="adm-btn"
                  onClick={apply}
                  disabled={!draft.trim()}
                >
                  войти
                </button>
              </>
            )}
          </div>

          <a className="adm-back" href="/">
            ← на сайт
          </a>
        </aside>
        <main className="adm-main">{children}</main>
      </div>
    </div>
  );
}
