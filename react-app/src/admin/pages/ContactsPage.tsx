import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import {
  ADMIN_LINKS_QUERY,
  CREATE_LINK_MUTATION,
  DELETE_LINK_MUTATION,
  UPDATE_LINK_MUTATION,
} from "../api/api";
import { useAdminToken } from "../hooks/useAdminToken";
import { useConfirm } from "../ui/ConfirmProvider";

type Link = {
  id: string;
  kind: string;
  label: string;
  url: string;
  order: number;
};

const KINDS: { value: string; label: string }[] = [
  { value: "GITHUB", label: "GitHub" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "TELEGRAM", label: "Telegram" },
  { value: "EMAIL", label: "Почта" },
  { value: "WEBSITE", label: "Сайт" },
];

const EMPTY_DRAFT = { kind: "GITHUB", label: "", url: "" };

export default function ContactsPage() {
  const { isEditor } = useAdminToken();
  const [{ data, fetching, error }] = useQuery({ query: ADMIN_LINKS_QUERY });
  const [, createLink] = useMutation(CREATE_LINK_MUTATION);
  const [, updateLink] = useMutation(UPDATE_LINK_MUTATION);
  const [, deleteLink] = useMutation(DELETE_LINK_MUTATION);

  const [rows, setRows] = useState<Link[]>([]);
  const [snapshot, setSnapshot] = useState<Record<string, Link>>({});
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const confirm = useConfirm();

  useEffect(() => {
    if (!data?.profile?.links || loaded) return;
    const list: Link[] = [...data.profile.links].sort(
      (a, b) => a.order - b.order,
    );
    setRows(list);
    setSnapshot(Object.fromEntries(list.map((l) => [l.id, l])));
    setLoaded(true);
  }, [data, loaded]);

  const patch = (id: string, changes: Partial<Link>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...changes } : r)));

  const say = (text: string) => {
    setStatus(text);
    window.setTimeout(() => setStatus(null), 2500);
  };

  const commit = async (row: Link) => {
    const before = snapshot[row.id];
    const changed =
      !before ||
      before.kind !== row.kind ||
      before.label !== row.label ||
      before.url !== row.url ||
      before.order !== row.order;

    if (!changed) return;

    if (!row.label.trim() || !row.url.trim()) {
      say("Подпись и ссылка не должны быть пустыми");
      if (before) patch(row.id, before);
      return;
    }

    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }

    const res = await updateLink({
      input: {
        id: row.id,
        kind: row.kind,
        label: row.label,
        url: row.url,
        order: row.order,
      },
    });

    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      if (before) patch(row.id, before);
      return;
    }

    setSnapshot((s) => ({ ...s, [row.id]: row }));
    say("Сохранено");
  };

  const add = async () => {
    const label = draft.label.trim();
    const url = draft.url.trim();
    if (!label || !url) return;

    const order = rows.length;

    if (!isEditor) {
      setRows((rs) => [
        ...rs,
        { id: `demo-${Date.now()}`, ...draft, label, url, order },
      ]);
      setDraft(EMPTY_DRAFT);
      say("Демо-режим: не сохранено");
      return;
    }

    const res = await createLink({
      input: { kind: draft.kind, label, url, order },
    });
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      return;
    }

    const created: Link = res.data.createLink;
    setRows((rs) => [...rs, created]);
    setSnapshot((s) => ({ ...s, [created.id]: created }));
    setDraft(EMPTY_DRAFT);
  };

  const remove = async (row: Link) => {
    if (
      !(await confirm({
        title: `Удалить контакт «${row.label}»?`,
        danger: true,
      }))
    )
      return;
    setRows((rs) => rs.filter((r) => r.id !== row.id));

    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }

    const res = await deleteLink({ id: row.id });
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
        Контакты <span className="adm-count">{rows.length}</span>
      </h1>

      <table className="adm-table">
        <thead>
          <tr>
            <th>Тип</th>
            <th>Подпись</th>
            <th>Ссылка</th>
            <th className="adm-th-num">№</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <select
                  value={row.kind}
                  onChange={(e) => {
                    const next = { ...row, kind: e.target.value };
                    patch(row.id, { kind: e.target.value });
                    commit(next);
                  }}
                >
                  {KINDS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  value={row.label}
                  onChange={(e) => patch(row.id, { label: e.target.value })}
                  onBlur={() => commit({ ...row })}
                />
              </td>
              <td>
                <input
                  value={row.url}
                  onChange={(e) => patch(row.id, { url: e.target.value })}
                  onBlur={() => commit({ ...row })}
                />
              </td>
              <td>
                <input
                  className="adm-num"
                  type="number"
                  value={row.order}
                  onChange={(e) =>
                    patch(row.id, { order: Number(e.target.value) })
                  }
                  onBlur={() => commit({ ...row })}
                />
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
              <select
                value={draft.kind}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, kind: e.target.value }))
                }
              >
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                value={draft.label}
                placeholder="@username"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, label: e.target.value }))
                }
              />
            </td>
            <td>
              <input
                value={draft.url}
                placeholder="https://t.me/username"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, url: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
            </td>
            <td />
            <td className="adm-td-right">
              <button
                className="adm-btn"
                onClick={add}
                disabled={!draft.label.trim() || !draft.url.trim()}
              >
                добавить
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p className="adm-hint">
        Для почты в ссылке пиши <code>mailto:you@example.com</code> — публичная
        страница откроет её почтовым клиентом.
      </p>

      <div className="adm-actions">
        {status && <span className="adm-hint">{status}</span>}
      </div>
    </div>
  );
}
