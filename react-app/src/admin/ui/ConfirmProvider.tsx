import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
type ConfirmOptions = {
  title: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};
type Pending = ConfirmOptions & {
  resolve: (ok: boolean) => void;
};
const ConfirmContext = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);
export const useConfirm = () => useContext(ConfirmContext);
export function ConfirmProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [pending, setPending] = useState<Pending | null>(null);
  const okRef = useRef<HTMLButtonElement>(null);
  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>(resolve => setPending({
    ...options,
    resolve
  })), []);
  const close = useCallback((ok: boolean) => {
    pending?.resolve(ok);
    setPending(null);
  }, [pending]);
  useEffect(() => {
    if (!pending) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [pending, close]);
  return <ConfirmContext.Provider value={confirm}>
      {children}

      {pending && <div className="adm-modal" role="dialog" aria-modal="true" aria-label={pending.title} onClick={() => close(false)}>
          <div className="adm-modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="adm-modal-title">{pending.title}</h3>
            {pending.text && <p className="adm-modal-text">{pending.text}</p>}

            <div className="adm-modal-actions">
              <button className="adm-btn" onClick={() => close(false)}>
                {pending.cancelLabel ?? "Отмена"}
              </button>
              <button ref={okRef} className={pending.danger ? "adm-btn adm-btn-danger" : "adm-btn adm-btn-main"} onClick={() => close(true)}>
                {pending.confirmLabel ?? "Удалить"}
              </button>
            </div>
          </div>
        </div>}
    </ConfirmContext.Provider>;
}