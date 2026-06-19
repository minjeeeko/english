import { createContext, useContext, useState, useEffect } from "react";

type FontSize = "normal" | "large";

interface FontSizeCtx {
  fontSize: FontSize;
  toggle: () => void;
}

const Ctx = createContext<FontSizeCtx>({ fontSize: "normal", toggle: () => {} });

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    try { return (localStorage.getItem("fontSize") as FontSize) ?? "normal"; }
    catch { return "normal"; }
  });

  useEffect(() => {
    document.body.classList.toggle("font-large", fontSize === "large");
    try { localStorage.setItem("fontSize", fontSize); } catch {}
  }, [fontSize]);

  const toggle = () => setFontSize((s) => (s === "normal" ? "large" : "normal"));

  return <Ctx.Provider value={{ fontSize, toggle }}>{children}</Ctx.Provider>;
}

export function useFontSize() {
  return useContext(Ctx);
}
