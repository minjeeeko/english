import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listEntries } from "../lib/entries";
import type { Entry } from "../lib/entries";
import { parseYoutube } from "../lib/youtube";

export default function AllPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"created_at" | "due_date">("created_at");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    listEntries({ search, tag: activeTag ?? undefined, sort }).then((data) => {
      setEntries(data);
      const tags = Array.from(new Set(data.flatMap((e) => e.tags)));
      setAllTags(tags);
    });
  }, [search, sort, activeTag]);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-stone-800 pb-10">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("/")} className="text-sm text-indigo-400 hover:text-indigo-600">
            ←
          </button>
          <h1 className="text-xl font-bold flex-1 text-stone-900">전체 구문</h1>
          <button
            onClick={() => setSort((s) => (s === "created_at" ? "due_date" : "created_at"))}
            className="text-xs border border-stone-200 rounded-full px-3 py-1 text-stone-500 hover:bg-stone-100 bg-white shadow-sm"
          >
            {sort === "created_at" ? "최신순" : "복습임박순"}
          </button>
        </div>

        <input
          className="input-base mb-3"
          placeholder="🔍 구문 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs rounded-full px-3 py-1 transition-colors ${
                !activeTag ? "bg-indigo-500 text-white" : "bg-white text-stone-500 border border-stone-200"
              }`}
            >
              전체
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(activeTag === t ? null : t)}
                className={`text-xs rounded-full px-3 py-1 transition-colors ${
                  activeTag === t ? "bg-indigo-500 text-white" : "bg-white text-stone-500 border border-stone-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {entries.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              onEdit={() => navigate(`/edit/${e.id}`)}
              onStudy={() => navigate(`/study/${e.id}`)}
            />
          ))}
          {entries.length === 0 && (
            <p className="text-stone-400 text-center py-12">구문이 없어요.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function EntryCard({ entry, onEdit, onStudy }: { entry: Entry; onEdit: () => void; onStudy: () => void }) {
  const ytId = entry.youtube_url ? parseYoutube(entry.youtube_url).id : null;

  return (
    <div
      onClick={onStudy}
      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-md active:scale-[0.99] transition-all border border-stone-100 shadow-sm"
    >
      <div className="flex gap-3 p-3">
        {ytId && (
          <img
            src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
            alt=""
            className="w-24 h-16 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 truncate">{entry.phrase}</p>
          {entry.translation && (
            <p className="text-sm text-stone-400 truncate">{entry.translation}</p>
          )}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-indigo-400 bg-indigo-50 rounded px-2 py-0.5 border border-indigo-100">
              📅 {entry.due_date}
            </span>
            <button
              onClick={(ev) => { ev.stopPropagation(); onEdit(); }}
              className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1"
            >
              편집
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
