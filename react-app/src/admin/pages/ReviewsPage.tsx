import { useConfirm } from "../ui/ConfirmProvider";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import {
  ADMIN_PROJECTS_LIGHT_QUERY,
  ADMIN_REVIEWS_QUERY,
  ADMIN_REVIEW_TOKENS_QUERY,
  CREATE_REVIEW_TOKEN_MUTATION,
  DELETE_REVIEW_MUTATION,
  REVOKE_REVIEW_TOKEN_MUTATION,
} from "../api/api";
import { useAdminToken } from "../hooks/useAdminToken";
import { DEMO_REVIEWS } from "../demo/fixtures";

type Review = {
  id: string;
  type: string;
  authorName: string;
  company: string | null;
  position: string | null;
  text: string;
  rating: number | null;
  projectId: string | null;
  createdAt: string;
};

type Token = {
  id: string;
  type: string;
  projectId: string | null;
  projectName: string | null;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const linkFor = (id: string) => `${window.location.origin}/review?review=${id}`;

export default function ReviewsPage() {
  const confirm = useConfirm();
  const { isEditor } = useAdminToken();

  const [{ data: reviewsData, error: reviewsError }] = useQuery({
    query: ADMIN_REVIEWS_QUERY,
  });
  const [{ data: projectsData }] = useQuery({
    query: ADMIN_PROJECTS_LIGHT_QUERY,
  });
  const [{ data: tokensData }, refetchTokens] = useQuery({
    query: ADMIN_REVIEW_TOKENS_QUERY,
    pause: !isEditor, // список токенов закрыт гвардой
  });

  const [, createToken] = useMutation(CREATE_REVIEW_TOKEN_MUTATION);
  const [, revokeToken] = useMutation(REVOKE_REVIEW_TOKEN_MUTATION);
  const [, deleteReview] = useMutation(DELETE_REVIEW_MUTATION);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);

  const [form, setForm] = useState({ type: "CLIENT", projectId: "", days: 30 });

  useEffect(() => {
    setReviews(isEditor ? (reviewsData?.reviews ?? []) : DEMO_REVIEWS);
  }, [reviewsData, isEditor]);

  useEffect(() => {
    if (tokensData?.reviewTokens) setTokens(tokensData.reviewTokens);
  }, [tokensData]);

  const projects: { id: string; name: string }[] =
    projectsData?.profile?.projects ?? [];

  const say = (text: string) => {
    setStatus(text);
    window.setTimeout(() => setStatus(null), 3000);
  };

  const copy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(linkFor(id));
      say("Ссылка скопирована");
    } catch {
      say("Не удалось скопировать — выдели вручную");
    }
  };

  const generate = async () => {
    if (form.type === "CLIENT" && !form.projectId) {
      say("Для отзыва заказчика выбери проект");
      return;
    }

    if (!isEditor) {
      say("Демо-режим: ссылка не создана");
      return;
    }

    const res = await createToken({
      input: {
        type: form.type,
        projectId: form.type === "CLIENT" ? form.projectId : null,
        days: Number(form.days),
      },
    });

    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      return;
    }

    const token: Token = res.data.createReviewToken;
    setTokens((list) => [token, ...list]);
    setFresh(token.id);
    copy(token.id);
  };

  const revoke = async (token: Token) => {
    const ok = await confirm({
      title: "Отозвать ссылку?",
      text: "Она перестанет работать, и отзыв по ней оставить будет нельзя.",
      confirmLabel: "Отозвать",
      danger: true,
    });
    if (!ok) return;
    setTokens((list) => list.filter((t) => t.id !== token.id));

    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }

    const res = await revokeToken({ id: token.id });
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      refetchTokens({ requestPolicy: "network-only" });
    }
  };

  const drop = async (review: Review) => {
    if (
      !(await confirm({
        title: `Удалить отзыв от «${review.authorName}»?`,
        danger: true,
      }))
    )
      return;
    setReviews((list) => list.filter((r) => r.id !== review.id));

    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }

    const res = await deleteReview({ id: review.id });
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      setReviews((list) => [review, ...list]);
    }
  };

  if (reviewsError)
    return <div className="adm-page adm-error">{reviewsError.message}</div>;

  return (
    <div className="adm-page adm-page-wide">
      <h1 className="adm-h1">Отзывы</h1>

      {/* ── генерация ссылки ─────────────────────── */}
      <section className="adm-card">
        <h2 className="adm-h2">Новая ссылка</h2>

        <div className="adm-grid2">
          <div className="adm-field">
            <label>Тип</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="CLIENT">Заказчик проекта</option>
              <option value="EMPLOYER">Работодатель</option>
            </select>
          </div>

          <div className="adm-field">
            <label>Срок жизни, дней</label>
            <input
              type="number"
              min={1}
              max={365}
              value={form.days}
              onChange={(e) =>
                setForm((f) => ({ ...f, days: Number(e.target.value) }))
              }
            />
          </div>
        </div>

        {form.type === "CLIENT" && (
          <div className="adm-field">
            <label>Проект</label>
            <select
              value={form.projectId}
              onChange={(e) =>
                setForm((f) => ({ ...f, projectId: e.target.value }))
              }
            >
              <option value="">— выбери проект —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="adm-actions">
          <button className="adm-btn adm-btn-main" onClick={generate}>
            создать ссылку
          </button>
          {status && <span className="adm-hint">{status}</span>}
        </div>

        {fresh && (
          <div className="adm-link-box">
            <input
              readOnly
              value={linkFor(fresh)}
              onFocus={(e) => e.target.select()}
            />
            <button className="adm-btn" onClick={() => copy(fresh)}>
              копировать
            </button>
          </div>
        )}
      </section>

      {/* ── выданные ссылки ──────────────────────── */}
      <section className="adm-card">
        <h2 className="adm-h2">
          Выданные ссылки <span className="adm-count">{tokens.length}</span>
        </h2>

        {!isEditor ? (
          <p className="adm-hint">Список доступен только в режиме записи.</p>
        ) : tokens.length === 0 ? (
          <p className="adm-hint">Пока ни одной.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Тип</th>
                <th>Проект</th>
                <th>Статус</th>
                <th>Истекает</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => {
                const expired = new Date(t.expiresAt) < new Date();
                return (
                  <tr key={t.id}>
                    <td>{t.type === "CLIENT" ? "Заказчик" : "Работодатель"}</td>
                    <td>{t.projectName ?? "—"}</td>
                    <td>
                      {t.isUsed ? (
                        <span className="adm-hint">использована</span>
                      ) : expired ? (
                        <span className="adm-error">просрочена</span>
                      ) : (
                        <button
                          className="adm-btn adm-btn-small"
                          onClick={() => copy(t.id)}
                        >
                          копировать
                        </button>
                      )}
                    </td>
                    <td className="adm-hint">{fmt(t.expiresAt)}</td>
                    <td className="adm-td-right">
                      <button
                        className="adm-del"
                        onClick={() => revoke(t)}
                        aria-label="Отозвать"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* ── полученные отзывы ────────────────────── */}
      <section className="adm-card">
        <h2 className="adm-h2">
          Полученные <span className="adm-count">{reviews.length}</span>
        </h2>

        {reviews.length === 0 && <p className="adm-hint">Отзывов пока нет.</p>}

        {reviews.map((r) => (
          <article className="adm-review" key={r.id}>
            <header>
              <strong>{r.authorName}</strong>
              {(r.position || r.company) && (
                <span className="adm-hint">
                  {[r.position, r.company].filter(Boolean).join(" · ")}
                </span>
              )}
              <span className="adm-hint adm-review-meta">
                {r.type === "CLIENT" ? "заказчик" : "работодатель"}
                {r.rating ? ` · ${r.rating}★` : ""} · {fmt(r.createdAt)}
              </span>
              <button
                className="adm-del"
                onClick={() => drop(r)}
                aria-label="Удалить"
              >
                ✕
              </button>
            </header>
            <p>{r.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
