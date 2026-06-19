import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listEntries } from "../lib/entries";
import type { Entry } from "../lib/entries";
import { listProgress } from "../lib/progress";
import type { Progress } from "../lib/progress";
import { parseYoutube } from "../lib/youtube";
import { HamSVG } from "../components/HamSVG";
import { TabBar } from "../components/TabBar";

export default function AllPage({ nickname }: { nickname: string }) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [progMap, setProgMap] = useState<Map<string, Progress>>(new Map());
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"recent" | "remembered" | "confused">("recent");

  useEffect(() => {
    Promise.all([listEntries({ sort: "created_at" }), listProgress(nickname)]).then(
      ([all, prog]) => {
        setEntries(all);
        setProgMap(new Map(prog.map((p) => [p.entry_id, p])));
      }
    );
  }, [nickname]);

  const byTab = tab === "remembered"
    ? entries.filter((e) => (progMap.get(e.id)?.srs_box ?? 1) > 1)
    : tab === "confused"
    ? entries.filter((e) => (progMap.get(e.id)?.srs_box ?? 1) === 1)
    : entries;

  const filtered = search
    ? byTab.filter((e) =>
        `${e.phrase} ${e.translation ?? ""}`.toLowerCase().includes(search.toLowerCase())
      )
    : byTab;

  return (
    <div className="min-h-screen bg-surface flex flex-col" style={{ paddingBottom: "calc(48px + env(safe-area-inset-bottom))" }}>
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

        {/* Tab — 최근순 / 기억남 / 헷갈림 */}
        <div className="flex gap-2">
          {([
            { key: "recent", label: "최근순" },
            { key: "remembered", label: "기억남" },
            { key: "confused", label: "헷갈림" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-[13px] font-[500] px-4 py-1.5 rounded-full border transition-colors
                ${tab === key
                  ? "bg-ink text-canvas border-ink"
                  : "bg-canvas text-steel border-hairline-strong"}`}
            >
              {label}
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

      <button
        onClick={(ev) => { ev.stopPropagation(); onEdit(); }}
        className="text-[12px] text-steel font-[500] px-1 flex-shrink-0"
      >
        편집
      </button>
    </div>
  );
}
