import { useNavigate, useLocation } from "react-router-dom";

export function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isNote = pathname === "/all";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-canvas border-t border-hairline flex items-center justify-around"
      style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))", paddingTop: "10px" }}
    >
      <TabItem
        label="홈"
        icon="🏠"
        active={isHome}
        onClick={() => navigate("/")}
      />
      <TabItem
        label="노트"
        icon="📚"
        active={isNote}
        onClick={() => navigate("/all")}
      />
    </nav>
  );
}

function TabItem({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 px-8 py-1">
      <span className="text-[22px] leading-none">{icon}</span>
      <span className={`text-[11px] font-[600] tracking-wide ${active ? "text-accent" : "text-steel"}`}>
        {label}
      </span>
      {active && <div className="w-4 h-[2px] bg-accent rounded-full" />}
    </button>
  );
}
