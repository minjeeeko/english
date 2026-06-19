import { useNavigate, useLocation } from "react-router-dom";

export function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isNote = pathname === "/all";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-paper border-t-2 border-ink flex items-center justify-around px-6 pb-safe"
      style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))", paddingTop: "9px" }}>
      {/* Home */}
      <button
        onClick={() => navigate("/")}
        className="flex flex-col items-center gap-0.5"
      >
        <div className={`w-[23px] h-[23px] rounded-lg border-2 flex items-center justify-center text-sm
          ${isHome ? "border-sky-key bg-sky-lite" : "border-ink bg-transparent"}`}>
          🏠
        </div>
        <span className={`text-[12px] font-bold ${isHome ? "text-sky-deep" : "text-muted"}`}>홈</span>
      </button>

      {/* Add (center) */}
      <button
        onClick={() => navigate("/add")}
        className="w-[50px] h-[50px] rounded-full bg-sky-key border-[2.5px] border-ink shadow-sticker-md flex items-center justify-center -mt-3 active:scale-95 transition-all"
      >
        <span className="text-white text-[28px] font-light leading-none">+</span>
      </button>

      {/* Note */}
      <button
        onClick={() => navigate("/all")}
        className="flex flex-col items-center gap-0.5"
      >
        <div className={`w-[23px] h-[23px] rounded-lg border-2 flex items-center justify-center text-sm
          ${isNote ? "border-sky-key bg-sky-lite" : "border-ink bg-transparent"}`}>
          📚
        </div>
        <span className={`text-[12px] font-bold ${isNote ? "text-sky-deep" : "text-muted"}`}>노트</span>
      </button>
    </nav>
  );
}
