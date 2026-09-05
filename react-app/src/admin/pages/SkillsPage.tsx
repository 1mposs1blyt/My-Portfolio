// src/admin/pages/SkillsPage.tsx
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import {
  ADMIN_SKILLS_QUERY,
  CREATE_SKILL_MUTATION,
  DELETE_SKILL_MUTATION,
  UPDATE_SKILL_MUTATION,
} from "../api/api";
import { useAdminToken } from "../hooks/useAdminToken";
import { useConfirm } from "../ui/ConfirmProvider";
import { DEMO_SKILLS } from "../demo/fixtures";

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
};

const CATEGORIES: { value: string; label: string }[] = [
  { value: "LANGUAGE", label: "Языки" },
  { value: "FRONTEND", label: "Фронтенд" },
  { value: "BACKEND", label: "Бэкенд" },
  { value: "DATABASE", label: "Базы данных" },
  { value: "INFRA", label: "Инфраструктура" },
  { value: "TOOL", label: "Инструменты" },
];

export default function SkillsPage() {
  const confirm = useConfirm();
  const { isEditor } = useAdminToken();
  const [{ data, fetching, error }] = useQuery({ query: ADMIN_SKILLS_QUERY });
  const [, createSkill] = useMutation(CREATE_SKILL_MUTATION);
  const [, updateSkill] = useMutation(UPDATE_SKILL_MUTATION);
  const [, deleteSkill] = useMutation(DELETE_SKILL_MUTATION);

  const [rows, setRows] = useState<Skill[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // что было в поле до правки — чтобы не слать мутацию, если ничего не изменилось
  const [snapshot, setSnapshot] = useState<Record<string, Skill>>({});

  const [draft, setDraft] = useState({ name: "", category: "LANGUAGE" });

  useEffect(() => {
    if (loaded) return;
    const list = isEditor ? data?.profile?.skills : DEMO_SKILLS;
    if (!list) return;
    setRows(list);
    setSnapshot(Object.fromEntries(list.map((s: any) => [s.id, s])));
    setLoaded(true);
  }, [data, loaded, isEditor]);

  useEffect(() => {
    setLoaded(false);
  }, [isEditor]);
  const patch = (id: string, changes: Partial<Skill>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...changes } : r)));

  const say = (text: string) => {
    setStatus(text);
    window.setTimeout(() => setStatus(null), 2500);
  };

  /** Отправляет строку на сервер, если она действительно изменилась */
  const commit = async (row: Skill) => {
    const before = snapshot[row.id];
    const changed =
      !before ||
      before.name !== row.name ||
      before.category !== row.category ||
      before.level !== row.level;

    if (!changed) return;

    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }

    const res = await updateSkill({
      input: {
        id: row.id,
        name: row.name,
        category: row.category,
        level: row.level,
      },
    });

    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      // откатываем к последнему сохранённому состоянию
      if (before) patch(row.id, before);
      return;
    }

    setSnapshot((s) => ({ ...s, [row.id]: row }));
    say("Сохранено");
  };

  const add = async () => {
    const name = draft.name.trim();
    if (!name) return;

    if (rows.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      say(`Навык «${name}» уже есть`);
      return;
    }

    if (!isEditor) {
      const local: Skill = {
        id: `demo-${Date.now()}`,
        name,
        category: draft.category,
        level: 3,
        order: rows.length,
      };
      setRows((rs) => [...rs, local]);
      setDraft({ name: "", category: draft.category });
      say("Демо-режим: не сохранено");
      return;
    }

    const res = await createSkill({
      input: { name, category: draft.category, level: 3, order: rows.length },
    });

    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      return;
    }

    const created: Skill = res.data.createSkill;
    setRows((rs) => [...rs, created]);
    setSnapshot((s) => ({ ...s, [created.id]: created }));
    setDraft({ name: "", category: draft.category });
  };

  const remove = async (row: Skill) => {
    if (
      !(await confirm({ title: `Удалить навык «${row.name}»?`, danger: true }))
    )
      return;
    setRows((rs) => rs.filter((r) => r.id !== row.id));

    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }

    const res = await deleteSkill({ id: row.id });
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      setRows((rs) => [...rs, row].sort((a, b) => a.order - b.order));
    }
  };

  if (fetching && !loaded)
    return <div className="adm-page adm-hint">Загрузка…</div>;
  if (error) return <div className="adm-page adm-error">{error.message}</div>;

  return (
    <div className="adm-page adm-page-wide">
      <h1 className="adm-h1">
        Навыки <span className="adm-count">{rows.length}</span>
      </h1>

      <table className="adm-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Категория</th>
            <th>Уровень</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  value={row.name}
                  onChange={(e) => patch(row.id, { name: e.target.value })}
                  onBlur={() => commit({ ...row })}
                />
              </td>
              <td>
                <select
                  value={row.category}
                  onChange={(e) => {
                    const next = { ...row, category: e.target.value };
                    patch(row.id, { category: e.target.value });
                    commit(next);
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <div
                  className="adm-level"
                  role="group"
                  aria-label={`Уровень ${row.level} из 5`}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`Уровень ${n}`}
                      data-on={String(n <= row.level)}
                      onClick={() => {
                        const next = { ...row, level: n };
                        patch(row.id, { level: n });
                        commit(next);
                      }}
                    />
                  ))}
                </div>
              </td>
              <td className="adm-td-right">
                <button
                  className="adm-del"
                  onClick={() => remove(row)}
                  aria-label="Удалить"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}

          <tr className="adm-row-new">
            <td>
              <input
                value={draft.name}
                placeholder="Новый навык"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
            </td>
            <td>
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, category: e.target.value }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </td>
            <td className="adm-hint">уровень 3 по умолчанию</td>
            <td className="adm-td-right">
              <button
                className="adm-btn"
                onClick={add}
                disabled={!draft.name.trim()}
              >
                добавить
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="adm-actions">
        {status && <span className="adm-hint">{status}</span>}
      </div>
    </div>
  );
}
