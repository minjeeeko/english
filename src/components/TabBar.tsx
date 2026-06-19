import { useNavigate, useLocation } from "react-router-dom";

export function TabBar({ tabH = 48 }: { tabH?: number }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isNote = pathname === "/all";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-canvas border-t border-hairline flex items-center justify-around"
      style={{
        height: `calc(${tabH}px + env(safe-area-inset-bottom))`,
      }}
    >
      <TabItem label="홈" icon="🏠" active={isHome} onClick={() => navigate("/")} />
      <TabItem label="노트" icon="📚" active={isNote} onClick={() => navigate("/all")} />
    </nav>
  );
}

function TabItem({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tab-fixed flex flex-col items-center gap-0.5 px-10" style={{ fontSize: "inherit" }}>
      <span className="tab-fixed leading-none" style={{ fontSize: "19px" }}>{icon}</span>
      <span className={`tab-fixed font-[600] tracking-wide ${active ? "text-accent" : "text-steel"}`} style={{ fontSize: "10px" }}>
        {label}
      </span>
      {active && <div className="w-3 h-[2px] bg-accent rounded-full" />}
    </button>
  );
}
