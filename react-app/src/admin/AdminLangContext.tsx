import { createContext, useContext, useEffect, useState } from "react";
type Lang = "RU" | "EN";
const Ctx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>(null!);
export const useAdminLang = () => useContext(Ctx);
export function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, _setLang] = useState<Lang>("RU");
  const setLang = (l: Lang) => {
    console.trace("SET LANG →", l);
    _setLang(l);
  };
  return (
    <Ctx.Provider
      value={{
        lang,
        setLang,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
