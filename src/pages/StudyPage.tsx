import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getEntry, gradeEntry, updateEntry, pickPhrase } from "../lib/entries";
import type { Entry } from "../lib/entries";
import { YoutubeClip } from "../components/YoutubeClip";
import { parseYoutube } from "../lib/youtube";

export default function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [entry, setEntry] = useState<Entry | null>((location.state as { entry?: Entry })?.entry ?? null);
  const [graded, setGraded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setGraded(false);
    getEntry(id).then(setEntry);
  }, [id]);

  const handleGrade = async (ok: boolean) => {
    if (!entry) return;
    const patch = gradeEntry(entry, ok);
    await updateEntry(entry.id, patch);
    setGraded(true);
  };

  const handleNext = async () => {
    const next = await pickPhrase();
    if (next) navigate(`/study/${next.id}`, { state: { entry: next } });
    else navigate("/");
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center text-muted">
        불러오는 중...
      </div>
    );
  }

  const ytData = entry.youtube_url ? parseYoutube(entry.youtube_url) : null;

  return (
    <div className="min-h-screen bg-paper text-ink pb-8">
      <div className="max-w-lg mx-auto px-[18px] pt-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full border-2 border-ink bg-white shadow-sticker flex items-center justify-center text-ink font-bold active:scale-95 transition-all"
          >
            ‹
          </button>
          <span className="text-[14px] text-muted">복습 {entry.review_count}회</span>
          <div className="w-9" />
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
          <div className="aspect-video w-full bg-sky-fill rounded-[16px] border-2 border-ink flex flex-col items-center justify-center text-muted text-sm gap-2 shadow-sticker">
            <span className="text-[32px]">▶</span>
            <span>유튜브 링크 없음</span>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {/* Phrase */}
          <div>
            <p className="text-[13px] font-[800] text-sky-deep uppercase tracking-wide mb-1">구문</p>
            <p className="text-[27px] font-[800] text-ink leading-tight">{entry.phrase}</p>
          </div>

          {/* Translation */}
          {entry.translation && (
            <div className="card p-4">
              <p className="text-[13px] font-[800] text-sky-deep mb-1">해석</p>
              <p className="text-[18px] text-ink">{entry.translation}</p>
            </div>
          )}

          {/* Explanation */}
          {entry.explanation && (
            <div className="card p-4">
              <p className="text-[13px] font-[800] text-sky-deep mb-2">상세 설명</p>
              <div className="prose prose-sm max-w-none text-ink text-[16px] leading-relaxed">
                <ReactMarkdown>{entry.explanation}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Example */}
          {(entry.example || entry.example_translation) && (
            <div className="rounded-[16px] border-2 border-dashed border-sky-key bg-sky-lite p-4">
              <p className="text-[13px] font-[800] text-sky-deep mb-2">예문</p>
              {entry.example && (
                <p className="text-[16px] font-[700] text-ink">"{entry.example}"</p>
              )}
              {entry.example_translation && (
                <p className="text-[14px] text-muted mt-1">{entry.example_translation}</p>
              )}
            </div>
          )}
        </div>

        {/* Grade buttons */}
        {!graded ? (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => handleGrade(true)}
              className="flex-1 btn-sky py-3 text-[15px]"
            >
              ✅ 기억남
            </button>
            <button
              onClick={() => handleGrade(false)}
              className="flex-1 btn-white py-3 text-[15px] border-rose-400 text-rose-500"
            >
              🤔 헷갈림
            </button>
          </div>
        ) : (
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate("/")} className="flex-1 btn-white py-3 text-[15px]">홈으로</button>
            <button onClick={handleNext} className="flex-1 btn-sky py-3 text-[15px]">다음 예문 ›</button>
          </div>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((t) => (
              <span key={t} className="text-[12px] bg-sky-lite text-sky-deep rounded-full px-3 py-0.5 border border-sky-border font-bold">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
