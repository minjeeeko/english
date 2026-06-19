import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listEntries } from "../lib/entries";
import type { Entry } from "../lib/entries";
import { parseYoutube } from "../lib/youtube";
import { HamSVG } from "../components/HamSVG";
import { TabBar } from "../components/TabBar";

export default function AllPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"created_at" | "due_date">("created_at");

  useEffect(() => {
    listEntries({ sort }).then(setEntries);
  }, [sort]);

  const filtered = search
    ? entries.filter((e) =>
        `${e.phrase} ${e.translation ?? ""}`.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  return (
    <div className="min-h-screen bg-surface flex flex-col" style={{ paddingBottom: "calc(56px + env(safe-area-inset-bottom))" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-[18px] py-3 bg-canvas border-b border-hairline">
        <span className="text-[18px] font-[700] text-ink">내 구문</span>
        <span className="text-[13px] text-steel">
          전체 <span className="text-accent font-[700]">{filtered.length}</span>개
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] py-[16px] flex flex-col gap-[10px]">
        {/* Search — Miro search-pill style */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[15px]">🔍</span>
          <input
            className="input-base pl-9"
            placeholder="구문 · 뜻 검색…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort — Miro pill-tab style */}
        <div className="flex gap-2">
          {(["created_at", "due_date"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`text-[13px] font-[500] px-4 py-1.5 rounded-full border transition-colors
                ${sort === s
                  ? "bg-ink text-canvas border-ink"
                  : "bg-canvas text-steel border-hairline-strong"}`}
            >
              {s === "created_at" ? "최근순" : "복습 적은순"}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <HamSVG size={52} mood="sleepy" />
            <p className="text-[14px] text-muted text-center">
              {search ? `'${search}' 구문이 없어요` : "구문을 추가해보세요!"}
            </p>
          </div>
        ) : (
          filtered.map((e) => (
            <NoteCard
              key={e.id}
              entry={e}
              onStudy={() => navigate(`/study/${e.id}`, { state: { entry: e } })}
              onEdit={() => navigate(`/edit/${e.id}`)}
            />
          ))
        )}
      </div>

      {/* FAB — add phrase */}
      <button
        onClick={() => navigate("/add")}
        className="fixed bottom-[calc(56px+env(safe-area-inset-bottom)+16px)] right-5 w-[52px] h-[52px] rounded-full bg-accent text-canvas shadow-card flex items-center justify-center text-[28px] font-light leading-none active:scale-95 transition-all z-20"
        style={{ bottom: "calc(56px + max(16px, env(safe-area-inset-bottom)) + 16px)" }}
      >
        +
      </button>

      <TabBar />
    </div>
  );
}

function NoteCard({ entry, onStudy, onEdit }: { entry: Entry; onStudy: () => void; onEdit: () => void }) {
  const ytId = entry.youtube_url ? parseYoutube(entry.youtube_url).id : null;

  return (
    <div
      onClick={onStudy}
      className="bg-canvas rounded-xl border border-hairline-soft shadow-subtle flex items-center gap-3 p-3 cursor-pointer active:scale-[0.99] transition-transform"
    >
      {/* Thumbnail */}
      {ytId ? (
        <img
          src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
          alt=""
          className="w-[56px] h-[42px] rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-[56px] h-[42px] rounded-lg bg-accent-fill border border-hairline-soft flex items-center justify-center flex-shrink-0">
          <span className="text-accent text-[18px]">▶</span>
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-[700] text-[15px] text-ink truncate">{entry.phrase}</p>
        {entry.translation && (
          <p className="text-[13px] text-muted truncate">{entry.translation}</p>
        )}
      </div>

      {/* Review count badge — Miro badge style */}
      <div className="flex flex-col items-center bg-surface rounded-lg px-2.5 py-1 flex-shrink-0 min-w-[40px]">
        <span className="text-[16px] font-[800] text-accent leading-none">{entry.review_count}</span>
        <span className="text-[10px] text-muted font-[500]">복습</span>
      </div>

      <button
        onClick={(ev) => { ev.stopPropagation(); onEdit(); }}
        className="text-[12px] text-steel font-[500] px-1 flex-shrink-0"
      >
        편집
      </button>
    </div>
  );
}
