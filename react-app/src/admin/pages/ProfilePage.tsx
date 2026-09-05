// src/admin/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { ADMIN_PROFILE_QUERY, UPDATE_PROFILE_MUTATION } from "../api/api.js";
import { useAdminToken } from "../hooks/useAdminToken.js";
import { DEMO_PROFILE } from "../demo/fixtures.js";

type ProfileForm = {
  name: string;
  headline: string;
  description: string;
  location: string;
  email: string;
};

const EMPTY: ProfileForm = {
  name: "",
  headline: "",
  description: "",
  location: "",
  email: "",
};

export default function ProfilePage() {
  const { isEditor } = useAdminToken();
  const [{ data, fetching, error }] = useQuery({ query: ADMIN_PROFILE_QUERY });
  const [, updateProfile] = useMutation(UPDATE_PROFILE_MUTATION);

  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  // заполняем форму один раз, когда приехали данные
  useEffect(() => {
    if (loaded) return;
    const p = isEditor ? data?.profile : DEMO_PROFILE;
    if (!p) return;
    setForm({
      name: p.name ?? "",
      headline: p.headline ?? "",
      description: p.description ?? "",
      location: p.location ?? "",
      email: p.email ?? "",
    });
    setLoaded(true);
  }, [data, loaded, isEditor]);

  useEffect(() => {
    setLoaded(false);
  }, [isEditor]);
  
  const field = (key: keyof ProfileForm) => ({
    value: form[key],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setStatus(null);
    },
  });

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setStatus({ kind: "err", text: "Имя и почта обязательны" });
      return;
    }

    // в демо-режиме правки живут в стейте формы и никуда не уходят
    if (!isEditor) {
      setStatus({ kind: "ok", text: "Демо-режим: изменения не сохранены" });
      return;
    }

    setSaving(true);
    const res = await updateProfile({
      input: {
        name: form.name,
        headline: form.headline,
        description: form.description,
        location: form.location || null,
        email: form.email,
      },
    });
    setSaving(false);

    setStatus(
      res.error
        ? { kind: "err", text: res.error.message.replace("[GraphQL] ", "") }
        : { kind: "ok", text: "Сохранено" },
    );
  };

  if (fetching && !loaded)
    return <div className="adm-page adm-hint">Загрузка…</div>;
  if (error) return <div className="adm-page adm-error">{error.message}</div>;

  return (
    <div className="adm-page">
      <h1 className="adm-h1">Профиль</h1>

      <div className="adm-field">
        <label htmlFor="p-name">Имя</label>
        <input id="p-name" {...field("name")} />
      </div>

      <div className="adm-field">
        <label htmlFor="p-headline">Заголовок</label>
        <input
          id="p-headline"
          {...field("headline")}
          placeholder="Full-stack разработчик"
        />
      </div>

      <div className="adm-field">
        <label htmlFor="p-description">О себе</label>
        <textarea id="p-description" {...field("description")} />
      </div>

      <div className="adm-field">
        <label htmlFor="p-location">Локация</label>
        <input id="p-location" {...field("location")} placeholder="Remote" />
      </div>

      <div className="adm-field">
        <label htmlFor="p-email">Почта</label>
        <input id="p-email" type="email" {...field("email")} />
      </div>

      <div className="adm-actions">
        <button
          className="adm-btn adm-btn-main"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Сохраняю…" : "Сохранить"}
        </button>
        {status && (
          <span className={status.kind === "err" ? "adm-error" : "adm-hint"}>
            {status.text}
          </span>
        )}
      </div>
    </div>
  );
}
