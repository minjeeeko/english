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
    <div className="min-h-screen bg-paper flex flex-col pb-[80px]">
      {/* Header */}
      <header className="flex items-center justify-between px-[18px] py-3 border-b border-sky-border bg-paper">
        <div className="flex items-center gap-2">
          <HamSVG size={34} />
          <span className="font-jua text-[24px] text-ink leading-none">햄글리시</span>
        </div>
        <span className="text-[13px] text-muted">{todayStr()}</span>
      </header>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-[18px] py-[14px] flex flex-col gap-[14px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted text-sm">불러오는 중...</div>
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Mascot quiz bubble */}
            <div className="flex items-start gap-3">
              <HamSVG size={60} />
              <div className="flex-1 relative bg-[#fff6e2] rounded-[16px] border-2 border-ink shadow-sticker p-3">
                {/* bubble tail */}
                <div className="absolute -left-[10px] top-4 w-0 h-0 border-t-[7px] border-b-[7px] border-r-[10px] border-t-transparent border-b-transparent border-r-ink" />
                <div className="absolute -left-[7px] top-[17px] w-0 h-0 border-t-[6px] border-b-[6px] border-r-[9px] border-t-transparent border-b-transparent border-r-[#fff6e2]" />
                <p className="text-[16px] font-[800] text-ink">안녕! 오늘도 한 입 🐾</p>
                <p className="text-[14px] text-muted mt-0.5">이 구문으로 예문을 만들어줘!</p>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[14px] font-[700] text-sky-deep">오늘의 퀴즈</span>
                <span className="text-[13px] text-muted">{quizIndex + 1} / {total}</span>
              </div>
              <div className="h-[9px] rounded-full bg-white border-2 border-ink overflow-hidden">
                <div
                  className="h-full bg-sky-key transition-all duration-300"
                  style={{ width: `${((quizIndex + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Phrase card */}
            <div
              className="bg-sky-fill rounded-[16px] border-2 border-ink shadow-sticker p-[18px] text-center cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => navigate(`/study/${entry.id}`, { state: { entry } })}
            >
              <p className="text-[28px] font-[800] text-ink leading-tight">{entry.phrase}</p>
              {entry.translation && (
                <p className="text-[15px] text-muted mt-1">{entry.translation}</p>
              )}
            </div>

            {/* Answer input */}
            <div className="card p-3">
              <textarea
                className="w-full bg-transparent text-ink placeholder-[#b8b3a8] text-[15px] resize-none focus:outline-none"
                style={{ minHeight: "88px" }}
                placeholder="영어로 예문을 써보세요…"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
            </div>

            {/* Model answer toggle */}
            {!showAnswer ? (
              <button
                className="btn-white py-3 px-6 w-full text-[15px]"
                onClick={() => setShowAnswer(true)}
              >
                햄글리 모범 답안 보기 👀
              </button>
            ) : (
              <div className="rounded-[16px] border-2 border-dashed border-sky-key bg-sky-lite p-4 animate-fadeIn">
                <p className="text-[13px] font-[800] text-sky-deep mb-2">햄글리의 예문</p>
                {entry.example ? (
                  <>
                    <p className="text-[16px] font-[700] text-ink">"{entry.example}"</p>
                    {entry.example_translation && (
                      <p className="text-[14px] text-muted mt-1">{entry.example_translation}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[14px] text-muted">등록된 모범 답안이 없어요.</p>
                )}
              </div>
            )}

            {/* Prev / Next */}
            <div className="flex gap-3">
              <button className="btn-white flex-1 py-3 text-[15px]" onClick={goPrev}>‹ 이전</button>
              <button className="btn-sky flex-1 py-3 text-[15px]" onClick={goNext}>다음 문제 ›</button>
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
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
      <HamSVG size={56} mood="sleepy" />
      <p className="text-[15px] text-muted text-center">아직 추가된 구문이 없어요.<br />아래 + 버튼으로 추가해보세요!</p>
    </div>
  );
}
