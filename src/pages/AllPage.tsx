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
    <div className="min-h-screen bg-paper flex flex-col pb-[80px]">
      <header className="flex items-center justify-between px-[18px] py-3 border-b border-sky-border bg-paper">
        <span className="font-jua text-[24px] text-ink">내 구문</span>
        <span className="text-[14px] text-muted">
          전체 <span className="text-sky-key font-bold">{filtered.length}</span>개
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] py-[14px] flex flex-col gap-[10px]">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-ink flex items-center justify-center bg-white">
            <span className="text-[11px]">🔍</span>
          </div>
          <input
            className="input-base pl-10"
            placeholder="구문 · 뜻 검색…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSort("created_at")}
            className={`text-[13px] font-bold px-4 py-1.5 rounded-full border-2 border-ink shadow-sticker transition-colors
              ${sort === "created_at" ? "bg-sky-key text-white" : "bg-white text-ink"}`}
          >
            최근순
          </button>
          <button
            onClick={() => setSort("due_date")}
            className={`text-[13px] font-bold px-4 py-1.5 rounded-full border-2 border-ink shadow-sticker transition-colors
              ${sort === "due_date" ? "bg-sky-key text-white" : "bg-white text-ink"}`}
          >
            복습 적은순
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <HamSVG size={56} mood="sleepy" />
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

      <TabBar />
    </div>
  );
}

function NoteCard({ entry, onStudy, onEdit }: { entry: Entry; onStudy: () => void; onEdit: () => void }) {
  const ytId = entry.youtube_url ? parseYoutube(entry.youtube_url).id : null;

  return (
    <div
      onClick={onStudy}
      className="card flex items-center gap-3 p-3 cursor-pointer active:scale-[0.99] transition-transform"
    >
      {ytId ? (
        <img
          src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
          alt=""
          className="w-[56px] h-[42px] rounded-[9px] object-cover border-2 border-ink flex-shrink-0"
        />
      ) : (
        <div className="w-[56px] h-[42px] rounded-[9px] border-2 border-ink bg-sky-fill flex items-center justify-center flex-shrink-0">
          <span className="text-sky-key text-[18px]">▶</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-[700] text-[16px] text-ink truncate">{entry.phrase}</p>
        {entry.translation && (
          <p className="text-[13px] text-muted truncate">{entry.translation}</p>
        )}
      </div>

      <div className="flex flex-col items-center border-2 border-sky-border bg-sky-lite rounded-[11px] px-2 py-1 flex-shrink-0">
        <span className="text-[17px] font-[800] text-sky-key leading-none">{entry.review_count}</span>
        <span className="text-[10px] text-muted">복습</span>
      </div>

      <button
        onClick={(ev) => { ev.stopPropagation(); onEdit(); }}
        className="text-[12px] text-muted hover:text-ink px-1 flex-shrink-0"
      >
        편집
      </button>
    </div>
  );
}
