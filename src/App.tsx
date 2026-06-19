import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listEntries } from "./lib/entries";
import type { Entry } from "./lib/entries";
import { HamSVG } from "./components/HamSVG";
import { TabBar } from "./components/TabBar";
import { requestNotificationPermission, scheduleNotifications } from "./lib/notifications";

function todayStr() {
  return new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

export default function App() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listEntries({ sort: "due_date" });
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    requestNotificationPermission().then((granted) => {
      if (granted) scheduleNotifications();
    });
  }, [fetchEntries]);

  const entry = entries[quizIndex] ?? null;
  const total = entries.length;
  const totalReviews = entries.reduce((sum, e) => sum + e.review_count, 0);

  const goNext = () => {
    setQuizIndex((i) => (i + 1) % Math.max(total, 1));
    setShowAnswer(false);
    setUserAnswer("");
  };
  const goPrev = () => {
    setQuizIndex((i) => (i - 1 + Math.max(total, 1)) % Math.max(total, 1));
    setShowAnswer(false);
    setUserAnswer("");
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col" style={{ paddingBottom: "calc(56px + env(safe-area-inset-bottom))" }}>
      {/* Header — date + total reviews */}
      <header className="flex items-center justify-between px-[18px] py-3 bg-canvas border-b border-hairline">
        <span className="text-[13px] text-steel font-[500]">{todayStr()}</span>
        <div className="flex items-center gap-1.5 text-[13px] text-steel font-[500]">
          <span>총 복습</span>
          <span className="text-accent font-[700]">{totalReviews}</span>
          <span>회</span>
        </div>
      </header>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-[18px] py-[16px] flex flex-col gap-[14px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted text-[14px]">불러오는 중…</div>
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Mascot quiz bubble */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <HamSVG size={56} />
              </div>
              <div className="flex-1 relative bg-[#fff8ee] rounded-xl border border-hairline shadow-subtle p-3">
                <div className="absolute -left-[8px] top-4 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-t-transparent border-b-transparent border-r-hairline" />
                <div className="absolute -left-[6px] top-[17px] w-0 h-0 border-t-[5px] border-b-[5px] border-r-[7px] border-t-transparent border-b-transparent border-r-[#fff8ee]" />
                <p className="text-[15px] font-[700] text-ink">안녕! 오늘도 한 입 🐾</p>
                <p className="text-[13px] text-steel mt-0.5">이 구문으로 예문을 만들어줘!</p>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-[600] text-accent-deep">오늘의 퀴즈</span>
                <span className="text-[13px] text-muted">{quizIndex + 1} / {total}</span>
              </div>
              <div className="h-[6px] rounded-full bg-hairline overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${((quizIndex + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Phrase card */}
            <div
              className="bg-accent-fill rounded-xl border border-hairline-soft shadow-subtle p-[18px] text-center cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => navigate(`/study/${entry.id}`, { state: { entry } })}
            >
              <p className="text-[26px] font-[800] text-ink leading-snug">{entry.phrase}</p>
              {entry.translation && (
                <p className="text-[14px] text-slate mt-1.5">{entry.translation}</p>
              )}
              <p className="text-[12px] text-muted mt-2 font-[500]">탭해서 영상으로 학습 →</p>
            </div>

            {/* Answer input */}
            <div className="bg-canvas rounded-xl border border-hairline shadow-subtle p-4">
              <textarea
                className="w-full bg-transparent text-ink placeholder-muted text-[15px] font-[400] resize-none focus:outline-none leading-relaxed"
                style={{ minHeight: "88px" }}
                placeholder="영어로 예문을 써보세요…"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
            </div>

            {/* Model answer toggle */}
            {!showAnswer ? (
              <button
                className="btn-secondary w-full py-3"
                onClick={() => setShowAnswer(true)}
              >
                햄글리 모범 답안 보기 👀
              </button>
            ) : (
              <div className="rounded-xl border border-dashed border-accent bg-accent-lite p-4 animate-fadeIn">
                <p className="text-[12px] font-[600] text-accent-deep uppercase tracking-wide mb-2">햄글리의 예문</p>
                {entry.example ? (
                  <>
                    <p className="text-[15px] font-[700] text-ink">"{entry.example}"</p>
                    {entry.example_translation && (
                      <p className="text-[13px] text-slate mt-1">{entry.example_translation}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[14px] text-muted">등록된 모범 답안이 없어요.</p>
                )}
              </div>
            )}

            {/* Prev / Next */}
            <div className="flex gap-3">
              <button className="btn-secondary flex-1 py-3" onClick={goPrev}>‹ 이전</button>
              <button className="btn-primary flex-1 py-3" onClick={goNext}>다음 문제 ›</button>
            </div>
          </>
        )}
      </div>

      <TabBar />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
      <HamSVG size={60} mood="sleepy" />
      <p className="text-[15px] text-steel text-center leading-relaxed">아직 추가된 구문이 없어요.<br />노트 탭에서 추가해보세요!</p>
    </div>
  );
}
