import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getEntry, gradeEntry, updateEntry, pickPhrase } from "../lib/entries";
import type { Entry } from "../lib/entries";
import { YoutubeClip } from "../components/YoutubeClip";
import { parseYoutube } from "../lib/youtube";

export default function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [graded, setGraded] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEntry(id).then(setEntry);
    setGraded(false);
  }, [id]);

  const handleGrade = async (ok: boolean) => {
    if (!entry) return;
    const patch = gradeEntry(entry, ok);
    await updateEntry(entry.id, patch);
    setGraded(true);
  };

  const handleNext = async () => {
    const next = await pickPhrase();
    if (next) navigate(`/study/${next.id}`);
    else navigate("/");
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        불러오는 중...
      </div>
    );
  }

  const ytData = entry.youtube_url ? parseYoutube(entry.youtube_url) : null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-8">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          ← 홈으로
        </button>

        {ytData?.id ? (
          <YoutubeClip
            videoId={ytData.id}
            start={entry.start_seconds ?? ytData.start ?? 0}
            end={entry.end_seconds ?? undefined}
            loop={true}
          />
        ) : (
          <div className="aspect-video w-full bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-sm">
            유튜브 링크 없음
          </div>
        )}

        <div className="mt-5 space-y-3">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-xl font-bold text-white">{entry.phrase}</p>
            {entry.translation && (
              <p className="text-slate-300 mt-1">{entry.translation}</p>
            )}
          </div>

          {entry.explanation && (
            <div className="bg-slate-800 rounded-xl p-4 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{entry.explanation}</ReactMarkdown>
            </div>
          )}
        </div>

        {!graded ? (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => handleGrade(true)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 font-semibold active:scale-95 transition-all"
            >
              ✅ 기억남
            </button>
            <button
              onClick={() => handleGrade(false)}
              className="flex-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-3 font-semibold active:scale-95 transition-all"
            >
              🤔 헷갈림
            </button>
          </div>
        ) : (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 font-semibold active:scale-95 transition-all"
            >
              홈으로
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 font-semibold active:scale-95 transition-all"
            >
              다음 예문 →
            </button>
          </div>
        )}

        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-indigo-900/50 text-indigo-300 rounded-full px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
