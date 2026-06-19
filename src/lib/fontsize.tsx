import { createContext, useContext, useState } from "react";

type FontSize = "normal" | "large";
const FontSizeContext = createContext<{ fontSize: FontSize; toggle: () => void }>({
  fontSize: "normal",
  toggle: () => {},
});

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const toggle = () => setFontSize((s) => (s === "normal" ? "large" : "normal"));
  return (
    <FontSizeContext.Provider value={{ fontSize, toggle }}>
      <div className={fontSize === "large" ? "text-large" : ""}>{children}</div>
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}
