import { useConfirm } from "../ui/ConfirmProvider";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "urql";
import { ADD_PROJECT_IMAGE_MUTATION, ADMIN_PROJECTS_QUERY, CREATE_PROJECT_MUTATION, DELETE_PROJECT_IMAGE_MUTATION, DELETE_PROJECT_MUTATION, REORDER_PROJECT_IMAGES_MUTATION, UPDATE_PROJECT_MUTATION } from "../api/api";
import { useAdminToken, getAdminToken } from "../hooks/useAdminToken";
import { DEMO_PROJECTS } from "../demo/fixtures";
const API_ORIGIN = import.meta.env.VITE_BACKEND_URL;
type ProjectImage = {
  id: string;
  url: string;
  order: number;
};
type Project = {
  id: string;
  name: string;
  description: string;
  repoUrl: string | null;
  liveUrl: string | null;
  stack: string[];
  order: number;
  images: ProjectImage[];
};
const blank = (order: number): Project => ({
  id: `new-${Date.now()}`,
  name: "",
  description: "",
  repoUrl: null,
  liveUrl: null,
  stack: [],
  order,
  images: []
});
const src = (url: string) => url.startsWith("http") ? url : API_ORIGIN + url;
export default function ProjectsPage() {
  const confirm = useConfirm();
  const {
    isEditor
  } = useAdminToken();
  const [{
    data,
    fetching,
    error
  }] = useQuery({
    query: ADMIN_PROJECTS_QUERY
  });
  const [, createProject] = useMutation(CREATE_PROJECT_MUTATION);
  const [, updateProject] = useMutation(UPDATE_PROJECT_MUTATION);
  const [, deleteProject] = useMutation(DELETE_PROJECT_MUTATION);
  const [, addImage] = useMutation(ADD_PROJECT_IMAGE_MUTATION);
  const [, deleteImage] = useMutation(DELETE_PROJECT_IMAGE_MUTATION);
  const [, reorderImages] = useMutation(REORDER_PROJECT_IMAGES_MUTATION);
  const [items, setItems] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  useEffect(() => {
    if (loaded) return;
    const source = isEditor ? data?.profile?.projects : DEMO_PROJECTS;
    if (!source) return;
    setItems(source.map((p: any) => ({
      ...p,
      repoUrl: p.repoUrl ?? "",
      liveUrl: p.liveUrl ?? "",
      images: [...(p.images ?? [])].sort((a, b) => a.order - b.order)
    })));
    setLoaded(true);
  }, [data, loaded, isEditor]);
  useEffect(() => {
    setLoaded(false);
  }, [isEditor]);
  const say = (text: string) => {
    setStatus(text);
    window.setTimeout(() => setStatus(null), 3000);
  };
  const patch = (id: string, changes: Partial<Project>) => setItems(list => list.map(p => p.id === id ? {
    ...p,
    ...changes
  } : p));
  const save = async (item: Project) => {
    if (!item.name.trim() || !item.description.trim()) {
      say("Название и описание обязательны");
      return;
    }
    const payload = {
      name: item.name,
      description: item.description,
      repoUrl: item.repoUrl || null,
      liveUrl: item.liveUrl || null,
      stack: item.stack,
      order: item.order
    };
    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }
    setSavingId(item.id);
    const isNew = item.id.startsWith("new-");
    const res = isNew ? await createProject({
      input: payload
    }) : await updateProject({
      input: {
        id: item.id,
        ...payload
      }
    });
    setSavingId(null);
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      return;
    }
    if (isNew) patch(item.id, {
      id: res.data.createProject.id
    });
    say("Сохранено");
  };
  const remove = async (item: Project) => {
    const count = item.images.length;
    const tail = count ? ` и ${count} изображени${count === 1 ? "е" : "й"}` : "";
    const ok = await confirm({
      title: `Удалить проект «${item.name}»?`,
      text: count ? `Вместе с ним удалится изображений: ${count}. Это необратимо.` : undefined,
      danger: true
    });
    if (!ok) return;
    setItems(list => list.filter(p => p.id !== item.id));
    if (item.id.startsWith("new-")) return;
    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }
    const res = await deleteProject({
      id: item.id
    });
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      setItems(list => [...list, item].sort((a, b) => a.order - b.order));
    }
  };
  const upload = async (item: Project, file: File) => {
    if (item.id.startsWith("new-")) {
      say("Сначала сохрани проект — картинке нужен его id");
      return;
    }
    if (!isEditor) {
      say("Демо-режим: загрузка недоступна");
      return;
    }
    setUploadingId(item.id);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch(`${API_ORIGIN}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`
        },
        body: form
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? `Загрузка не удалась (${response.status})`);
      }
      const {
        url
      } = await response.json();
      const res = await addImage({
        input: {
          projectId: item.id,
          url
        }
      });
      if (res.error) throw new Error(res.error.message.replace("[GraphQL] ", ""));
      patch(item.id, {
        images: [...item.images, res.data.addProjectImage]
      });
      say("Картинка загружена");
    } catch (e: any) {
      say(e.message ?? "Ошибка загрузки");
    } finally {
      setUploadingId(null);
    }
  };
  const dropImage = async (item: Project, image: ProjectImage) => {
    if (!(await confirm({
      title: "Удалить изображение?",
      danger: true
    }))) return;
    patch(item.id, {
      images: item.images.filter(i => i.id !== image.id)
    });
    if (!isEditor) {
      say("Демо-режим: не сохранено");
      return;
    }
    const res = await deleteImage({
      id: image.id
    });
    if (res.error) {
      say(res.error.message.replace("[GraphQL] ", ""));
      patch(item.id, {
        images: item.images
      });
    }
  };
  const moveImage = async (item: Project, index: number, dir: -1 | 1) => {
    const next = [...item.images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    patch(item.id, {
      images: next
    });
    if (!isEditor) return;
    const res = await reorderImages({
      ids: next.map(i => i.id)
    });
    if (res.error) say(res.error.message.replace("[GraphQL] ", ""));
  };
  if (fetching && !loaded) return <div className="adm-page adm-hint">Загрузка…</div>;
  if (error) return <div className="adm-page adm-error">{error.message}</div>;
  return <div className="adm-page adm-page-wide">
      <h1 className="adm-h1">
        Проекты <span className="adm-count">{items.length}</span>
      </h1>

      {items.map(item => <section className="adm-card" key={item.id}>
          <div className="adm-grid2">
            <div className="adm-field">
              <label>Название</label>
              <input value={item.name} onChange={e => patch(item.id, {
            name: e.target.value
          })} />
            </div>
            <div className="adm-field">
              <label>Порядок</label>
              <input className="adm-num" type="number" value={item.order} onChange={e => patch(item.id, {
            order: Number(e.target.value)
          })} />
            </div>
          </div>

          <div className="adm-field">
            <label>Описание</label>
            <textarea value={item.description} onChange={e => patch(item.id, {
          description: e.target.value
        })} />
          </div>

          <div className="adm-grid2">
            <div className="adm-field">
              <label>Репозиторий</label>
              <input value={item.repoUrl ?? ""} placeholder="https://github.com/…" onChange={e => patch(item.id, {
            repoUrl: e.target.value
          })} />
            </div>
            <div className="adm-field">
              <label>Демо</label>
              <input value={item.liveUrl ?? ""} placeholder="https://…" onChange={e => patch(item.id, {
            liveUrl: e.target.value
          })} />
            </div>
          </div>

          <div className="adm-field">
            <label>Стек — через запятую</label>
            <input value={item.stack.join(", ")} onChange={e => patch(item.id, {
          stack: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
        })} placeholder="TypeScript, React, Node.js" />
          </div>

          <div className="adm-field">
            <label>
              Изображения{" "}
              <span className="adm-hint">— первое становится обложкой</span>
            </label>

            <div className="adm-shots">
              {item.images.map((image, i) => <figure className="adm-shot" key={image.id}>
                  <img src={src(image.url)} alt="" />
                  <figcaption>
                    <button className="adm-icon" onClick={() => moveImage(item, i, -1)} disabled={i === 0} aria-label="Левее">
                      ←
                    </button>
                    <button className="adm-icon" onClick={() => moveImage(item, i, 1)} disabled={i === item.images.length - 1} aria-label="Правее">
                      →
                    </button>
                    <button className="adm-del" onClick={() => dropImage(item, image)} aria-label="Удалить">
                      ✕
                    </button>
                  </figcaption>
                </figure>)}
            </div>

            <input ref={el => {
          fileInputs.current[item.id] = el;
        }} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={e => {
          const file = e.target.files?.[0];
          if (file) upload(item, file);
          e.target.value = "";
        }} />
            <button className="adm-btn adm-btn-small" onClick={() => fileInputs.current[item.id]?.click()} disabled={uploadingId === item.id}>
              {uploadingId === item.id ? "Загружаю…" : "+ загрузить картинку"}
            </button>
          </div>

          <div className="adm-actions">
            <button className="adm-btn adm-btn-main" onClick={() => save(item)} disabled={savingId === item.id}>
              {savingId === item.id ? "Сохраняю…" : "Сохранить"}
            </button>
            <button className="adm-btn" onClick={() => remove(item)}>
              удалить
            </button>
          </div>
        </section>)}

      <button className="adm-btn" onClick={() => setItems(list => [...list, blank(list.length)])}>
        + проект
      </button>

      <div className="adm-actions">
        {status && <span className="adm-hint">{status}</span>}
      </div>
    </div>;
}