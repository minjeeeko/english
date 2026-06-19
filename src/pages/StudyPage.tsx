import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getEntry, listEntries } from "../lib/entries";
import type { Entry } from "../lib/entries";
import { listProgress, upsertProgress, calcGrade } from "../lib/progress";
import type { Progress } from "../lib/progress";
import { YoutubeClip } from "../components/YoutubeClip";
import { parseYoutube } from "../lib/youtube";

export default function StudyPage({ nickname }: { nickname: string }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [entry, setEntry] = useState<Entry | null>((location.state as { entry?: Entry })?.entry ?? null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [graded, setGraded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setGraded(false);
    getEntry(id).then((e) => { if (e) setEntry(e); });
    listProgress(nickname).then((list) => {
      setProgress(list.find((p) => p.entry_id === id) ?? null);
    });
  }, [id, nickname]);

  const handleGrade = async (ok: boolean) => {
    if (!entry) return;
    const patch = calcGrade(progress, ok);
    await upsertProgress(nickname, entry.id, patch);
    setProgress({ nickname, entry_id: entry.id, ...patch });
    setGraded(true);
  };

  const handleNext = async () => {
    const [all, prog] = await Promise.all([listEntries({}), listProgress(nickname)]);
    const progMap = new Map(prog.map((p) => [p.entry_id, p]));
    const today = new Date().toISOString().slice(0, 10);
    const due = all.filter((e) => (progMap.get(e.id)?.due_date ?? today) <= today);
    const pool = due.length > 0 ? due : all;
    const next = pool[Math.floor(Math.random() * pool.length)];
    if (next) navigate(`/study/${next.id}`, { state: { entry: next } });
    else navigate("/");
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-muted text-[14px]">
        불러오는 중…
      </div>
    );
  }

  const ytData = entry.youtube_url ? parseYoutube(entry.youtube_url) : null;

  return (
    <div className="min-h-screen bg-surface text-ink pb-10">
      <div className="max-w-lg mx-auto px-[18px] pt-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[14px] text-steel font-[500] active:text-ink"
          >
            ‹ 뒤로
          </button>
          <span />
        </div>

        {/* YouTube */}
        {ytData?.id ? (
          <YoutubeClip
            videoId={ytData.id}
            start={entry.start_seconds ?? ytData.start ?? 0}
            end={entry.end_seconds ?? undefined}
            loop={true}
          />
        ) : (
          <div className="aspect-video w-full bg-accent-fill rounded-xl border border-hairline-soft flex flex-col items-center justify-center text-slate text-[14px] gap-2 shadow-subtle">
            <span className="text-[28px]">▶</span>
            <span>유튜브 링크 없음</span>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3">
          {/* Phrase */}
          <div>
            <p className="text-[11px] font-[600] text-accent uppercase tracking-widest mb-1">구문</p>
            <p className="text-[26px] font-[800] text-ink leading-tight">{entry.phrase}</p>
          </div>

          {/* Translation */}
          {entry.translation && (
            <div className="bg-canvas rounded-xl border border-hairline-soft shadow-subtle p-4">
              <p className="text-[11px] font-[600] text-accent-deep uppercase tracking-widest mb-1.5">해석</p>
              <p className="text-[17px] text-ink font-[400]">{entry.translation}</p>
            </div>
          )}

          {/* Explanation */}
          {entry.explanation && (
            <div className="bg-canvas rounded-xl border border-hairline-soft shadow-subtle p-4">
              <p className="text-[11px] font-[600] text-accent-deep uppercase tracking-widest mb-2">상세 설명</p>
              <div className="prose prose-sm max-w-none text-ink text-[15px] leading-relaxed">
                <ReactMarkdown>{entry.explanation}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Example */}
          {(entry.example || entry.example_translation) && (
            <div className="bg-accent-lite rounded-xl border border-dashed border-accent p-4">
              <p className="text-[11px] font-[600] text-accent-deep uppercase tracking-widest mb-2">예문</p>
              {entry.example && (
                <p className="text-[15px] font-[700] text-ink">"{entry.example}"</p>
              )}
              {entry.example_translation && (
                <p className="text-[13px] text-slate mt-1">{entry.example_translation}</p>
              )}
            </div>
          )}
        </div>

        {/* Grade — review_count only increments when these buttons are pressed */}
        {!graded ? (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => handleGrade(true)}
              className="flex-1 btn-primary py-3 text-[15px]"
            >
              ✅ 기억남
            </button>
            <button
              onClick={() => handleGrade(false)}
              className="flex-1 btn-secondary py-3 text-[15px] text-[#c0392b] border-[#e0b0b0]"
            >
              🤔 헷갈림
            </button>
          </div>
        ) : (
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate("/")} className="flex-1 btn-secondary py-3 text-[15px]">홈으로</button>
            <button onClick={handleNext} className="flex-1 btn-primary py-3 text-[15px]">다음 예문 ›</button>
          </div>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((t) => (
              <span key={t} className="text-[12px] bg-surface text-steel rounded-full px-3 py-0.5 border border-hairline font-[500]">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
