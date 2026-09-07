import { useConfirm } from "../ui/ConfirmProvider";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import {
  ADMIN_EXPERIENCE_QUERY,
  CREATE_EXPERIENCE_MUTATION,
  DELETE_EXPERIENCE_MUTATION,
  UPDATE_EXPERIENCE_MUTATION,
} from "../api/api";
import { useAdminToken } from "../hooks/useAdminToken";
import { DEMO_EXPERIENCE } from "../demo/fixtures";
import { useAdminLang } from "../AdminLangContext";
type Achievement = {
  id?: string;
  text: string;
  order: number;
};
type Experience = {
  id: string;
  company: string;
  position: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  achievements: Achievement[];
};
const toDateInput = (value: string | null): string =>
  value ? new Date(value).toISOString().slice(0, 10) : "";
const blank = (): Experience => ({
  id: `new-${Date.now()}`,
  company: "",
  position: "",
  description: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: null,
  achievements: [],
});
export default function ExperiencePage() {
  const { lang } = useAdminLang();

  const confirm = useConfirm();
  const { isEditor } = useAdminToken();
  const [{ data, fetching, error }] = useQuery({
    query: ADMIN_EXPERIENCE_QUERY, // или ADMIN_PROJECTS_QUERY
    variables: { lang },
    requestPolicy: "network-only",
  });

  const [, createExperience] = useMutation(CREATE_EXPERIENCE_MUTATION);
  const [, updateExperience] = useMutation(UPDATE_EXPERIENCE_MUTATION);
  const [, deleteExperience] = useMutation(DELETE_EXPERIENCE_MUTATION);
  const [items, setItems] = useState<Experience[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  useEffect(() => {
    if (loaded) return;
    const source = isEditor ? data?.profile?.experience : DEMO_EXPERIENCE;
    if (!source) return;
    setItems(
      source.map((e: any) => ({
        ...e,
        startDate: toDateInput(e.startDate),
        endDate: e.endDate ? toDateInput(e.endDate) : null,
        description: e.description ?? "",
        achievements: [...(e.achievements ?? [])].sort(
          (a, b) => a.order - b.order,
        ),
      })),
    );
    setLoaded(true);
  }, [data, isEditor]);
  useEffect(() => {
    setLoaded(false);
  }, [isEditor, lang]);
  const say = (text: string) => {
    setStatus(text);
    window.setTimeout(() => setStatus(null), 2500);
  };
  const patch = (id: string, changes: Partial<Experience>) =>
    setItems((list) =>
      list.map((e) =>
        e.id === id
          ? {
              ...e,
              ...changes,
            }
          : e,
      ),
    );
  const patchAchievement = (id: string, index: number, text: string) =>
    setItems((list) =>
      list.map((e) =>
        e.id === id
          ? {
              ...e,
              achievements: e.achievements.map((a, i) =>
                i === index
                  ? {
                      ...a,
                      text,
                    }
                  : a,
              ),
            }
          : e,
      ),
    );
  const addAchievement = (id: string) =>
    setItems((list) =>
      list.map((e) =>
        e.id === id
          ? {
              ...e,
              achievements: [
                ...e.achievements,
                {
                  text: "",
                  order: e.achievements.length,
                },
              ],
            }
          : e,
      ),
    );
  const removeAchievement = (id: string, index: number) =>
    setItems((list) =>
      list.map((e) =>
        e.id === id
          ? {
              ...e,
              achievements: e.achievements.filter((_, i) => i !== index),
            }
          : e,
      ),
    );
  const moveAchievement = (id: string, index: number, dir: -1 | 1) =>
    setItems((list) =>
      list.map((e) => {
        if (e.id !== id) return e;
        const next = [...e.achievements];
        const target = index + dir;
        if (target < 0 || target >= next.length) return e;
        [next[index], next[target]] = [next[target], next[index]];
        return {
          ...e,
          achievements: next,
        };
      }),
    );
  const save = async (item: Experience) => {
    if (!item.company.trim() || !item.position.trim()) {
      say("Компания и должность обязательны");
      return;
    }
    const achievements = item.achievements
      .map((a) => a.text.trim())
      .filter(Boolean);
    const payload = {
      company: item.company,
      position: item.position,
      description: item.description || null,
      startDate: item.startDate,
      endDate: item.endDate || null,
      achievements,
      language: lang
    };
    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }
    setSavingId(item.id);
    const isNew = item.id.startsWith("new-");
    const res = isNew
      ? await createExperience({
          input: payload,
        })
      : await updateExperience({
          input: {
            id: item.id,
            ...payload,
          },
        });
    setSavingId(null);
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      return;
    }
    if (isNew) {
      const created = res.data.createExperience;
      patch(item.id, {
        id: created.id,
        startDate: toDateInput(created.startDate),
        endDate: created.endDate ? toDateInput(created.endDate) : null,
      });
    }
    say("Сохранено");
  };
  const remove = async (item: Experience) => {
    const ok = await confirm({
      title: `Удалить «${item.position} · ${item.company}»?`,
      text: item.achievements.length
        ? `Вместе с записью удалятся достижения: ${item.achievements.length}.`
        : undefined,
      danger: true,
    });
    if (!ok) return;
    setItems((list) => list.filter((e) => e.id !== item.id));
    if (item.id.startsWith("new-")) return;
    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }
    const res = await deleteExperience({
      id: item.id,
    });
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      setItems((list) => [...list, item]);
    }
  };
  if (fetching && !loaded)
    return <div className="adm-page adm-hint">Загрузка…</div>;
  if (error) return <div className="adm-page adm-error">{error.message}</div>;
  return (
    <div className="adm-page adm-page-wide">
      <h1 className="adm-h1">
        Опыт <span className="adm-count">{items.length}</span>
      </h1>

      {items.map((item) => (
        <section className="adm-card" key={item.id}>
          <div className="adm-grid2">
            <div className="adm-field">
              <label>Компания</label>
              <input
                value={item.company}
                onChange={(e) =>
                  patch(item.id, {
                    company: e.target.value,
                  })
                }
              />
            </div>
            <div className="adm-field">
              <label>Должность</label>
              <input
                value={item.position}
                onChange={(e) =>
                  patch(item.id, {
                    position: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="adm-grid2">
            <div className="adm-field">
              <label>Начало</label>
              <input
                type="date"
                value={item.startDate}
                onChange={(e) =>
                  patch(item.id, {
                    startDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="adm-field">
              <label>Окончание</label>
              <input
                type="date"
                value={item.endDate ?? ""}
                onChange={(e) =>
                  patch(item.id, {
                    endDate: e.target.value || null,
                  })
                }
              />
              <label className="adm-check">
                <input
                  type="checkbox"
                  checked={!item.endDate}
                  onChange={(e) =>
                    patch(item.id, {
                      endDate: e.target.checked
                        ? null
                        : toDateInput(new Date().toISOString()),
                    })
                  }
                />
                работаю сейчас
              </label>
            </div>
          </div>

          <div className="adm-field">
            <label>Описание</label>
            <textarea
              value={item.description ?? ""}
              onChange={(e) =>
                patch(item.id, {
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="adm-field">
            <label>Достижения</label>
            {item.achievements.map((a, i) => (
              <div className="adm-ach-row" key={i}>
                <input
                  value={a.text}
                  onChange={(e) => patchAchievement(item.id, i, e.target.value)}
                  placeholder="Что сделал"
                />
                <button
                  className="adm-icon"
                  onClick={() => moveAchievement(item.id, i, -1)}
                  disabled={i === 0}
                  aria-label="Выше"
                >
                  ↑
                </button>
                <button
                  className="adm-icon"
                  onClick={() => moveAchievement(item.id, i, 1)}
                  disabled={i === item.achievements.length - 1}
                  aria-label="Ниже"
                >
                  ↓
                </button>
                <button
                  className="adm-del"
                  onClick={() => removeAchievement(item.id, i)}
                  aria-label="Удалить"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="adm-btn adm-btn-small"
              onClick={() => addAchievement(item.id)}
            >
              + достижение
            </button>
          </div>

          <div className="adm-actions">
            <button
              className="adm-btn adm-btn-main"
              onClick={() => save(item)}
              disabled={savingId === item.id}
            >
              {savingId === item.id ? "Сохраняю…" : "Сохранить"}
            </button>
            <button className="adm-btn" onClick={() => remove(item)}>
              удалить
            </button>
          </div>
        </section>
      ))}

      <button
        className="adm-btn"
        onClick={() => setItems((list) => [...list, blank()])}
      >
        + место работы
      </button>

      <div className="adm-actions">
        {status && <span className="adm-hint">{status}</span>}
      </div>
    </div>
  );
}
