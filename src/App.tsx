import { useEffect, useState, useCallback, useRef } from "react";
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
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [inputDraft, setInputDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  // Scroll to bottom whenever chat updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [submitted, showAnswer, quizIndex]);

  const entry = entries[quizIndex] ?? null;
  const total = entries.length;
  const totalReviews = entries.reduce((sum, e) => sum + e.review_count, 0);

  const handleSend = () => {
    if (!inputDraft.trim()) return;
    setUserAnswer(inputDraft.trim());
    setInputDraft("");
    setSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const goNext = () => {
    setQuizIndex((i) => (i + 1) % Math.max(total, 1));
    setSubmitted(false);
    setShowAnswer(false);
    setUserAnswer("");
    setInputDraft("");
  };
  const goPrev = () => {
    setQuizIndex((i) => (i - 1 + Math.max(total, 1)) % Math.max(total, 1));
    setSubmitted(false);
    setShowAnswer(false);
    setUserAnswer("");
    setInputDraft("");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#b2c7d9", paddingBottom: "calc(56px + env(safe-area-inset-bottom))" }}>
      {/* Chat header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#3c3c3c]">
        <span className="text-[14px] font-[600] text-white">햄글리시 🐹</span>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#aaa]">{todayStr()}</span>
          <span className="text-[12px] text-[#aaa]">복습 <span className="text-[#fee500] font-[700]">{totalReviews}</span>회</span>
        </div>
      </header>

      {/* Progress bar */}
      {!loading && total > 0 && (
        <div className="px-4 pt-2 pb-1 bg-[#3c3c3c] flex items-center gap-3">
          <div className="flex-1 h-[4px] rounded-full bg-[#555] overflow-hidden">
            <div
              className="h-full bg-[#fee500] rounded-full transition-all duration-300"
              style={{ width: `${((quizIndex + 1) / total) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-[#aaa] flex-shrink-0">{quizIndex + 1} / {total}</span>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[13px] text-white/70">불러오는 중…</span>
          </div>
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : entry && (
          <>
            {/* Ham greeting */}
            <HamBubble>
              <p className="text-[14px] font-[600] text-[#1c1c1e]">안녕! 오늘도 한 입 🐾</p>
              <p className="text-[13px] text-[#6b6f7e] mt-0.5">이 구문으로 예문을 만들어줘!</p>
            </HamBubble>

            {/* Ham phrase card */}
            <HamBubble>
              <div
                className="cursor-pointer active:opacity-80 transition-opacity"
                onClick={() => navigate(`/study/${entry.id}`, { state: { entry } })}
              >
                <p className="text-[11px] font-[600] text-[#34b3e0] uppercase tracking-wider mb-1.5">오늘의 구문</p>
                <p className="text-[22px] font-[800] text-[#1c1c1e] leading-tight">{entry.phrase}</p>
                {entry.translation && (
                  <p className="text-[13px] text-[#6b6f7e] mt-1">{entry.translation}</p>
                )}
                <p className="text-[11px] text-[#a5a8b5] mt-2">탭해서 영상으로 학습 →</p>
              </div>
            </HamBubble>

            {/* Ham prompt to write */}
            <HamBubble>
              <p className="text-[14px] text-[#1c1c1e]">위 구문을 사용해서 예문을 써봐! 😊</p>
            </HamBubble>

            {/* User's answer (after submit) */}
            {submitted && (
              <div className="flex justify-end animate-fadeSlideIn">
                <div className="max-w-[75%]">
                  <div className="bg-[#fee500] rounded-[18px] rounded-tr-[4px] px-4 py-2.5 shadow-subtle">
                    <p className="text-[14px] text-[#1c1c1e] leading-relaxed whitespace-pre-wrap">{userAnswer}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ham response after submit */}
            {submitted && !showAnswer && (
              <HamBubble>
                <p className="text-[14px] text-[#1c1c1e]">잘 썼어! 모범 답안도 볼래? 👀</p>
                <button
                  className="mt-2 text-[13px] font-[600] text-[#34b3e0] underline underline-offset-2"
                  onClick={() => setShowAnswer(true)}
                >
                  모범 답안 보기
                </button>
              </HamBubble>
            )}

            {/* Ham model answer */}
            {showAnswer && (
              <HamBubble>
                <p className="text-[11px] font-[600] text-[#34b3e0] uppercase tracking-wider mb-1.5">햄글리의 예문</p>
                {entry.example ? (
                  <>
                    <p className="text-[14px] font-[700] text-[#1c1c1e] leading-relaxed">"{entry.example}"</p>
                    {entry.example_translation && (
                      <p className="text-[12px] text-[#6b6f7e] mt-1">{entry.example_translation}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[13px] text-[#a5a8b5]">등록된 모범 답안이 없어요.</p>
                )}
              </HamBubble>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Prev / Next nav */}
      {!loading && total > 0 && (
        <div className="flex gap-2 px-3 pb-2">
          <button
            onClick={goPrev}
            className="flex-1 py-2 rounded-full bg-white/80 text-[13px] font-[600] text-[#555a6a] active:bg-white/60 transition-colors"
          >
            ‹ 이전 문제
          </button>
          <button
            onClick={goNext}
            className="flex-1 py-2 rounded-full bg-[#fee500] text-[13px] font-[600] text-[#1c1c1e] active:bg-[#fcd600] transition-colors"
          >
            다음 문제 ›
          </button>
        </div>
      )}

      {/* Chat input bar */}
      {!loading && total > 0 && (
        <div className="bg-[#f0f0f0] border-t border-[#d0d0d0] px-3 py-2 flex items-end gap-2">
          <textarea
            ref={inputRef}
            className="flex-1 bg-white rounded-[20px] px-4 py-2.5 text-[14px] text-[#1c1c1e] placeholder-[#a5a8b5] resize-none focus:outline-none leading-relaxed"
            style={{ minHeight: "40px", maxHeight: "100px" }}
            rows={1}
            placeholder="예문을 써보세요…"
            value={inputDraft}
            onChange={(e) => {
              setInputDraft(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!inputDraft.trim()}
            className="w-9 h-9 rounded-full bg-[#fee500] disabled:bg-[#e0e0e0] flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      <TabBar />
    </div>
  );
}

function HamBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 animate-fadeSlideIn">
      <div className="flex-shrink-0 mt-1">
        <HamSVG size={36} />
      </div>
      <div className="max-w-[78%]">
        <p className="text-[11px] font-[500] text-white/80 mb-1">햄글리</p>
        <div className="bg-white rounded-[18px] rounded-tl-[4px] px-4 py-2.5 shadow-subtle">
          {children}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
      <HamSVG size={60} mood="sleepy" />
      <div className="bg-white/80 rounded-[18px] px-5 py-3 text-center">
        <p className="text-[14px] text-[#555a6a]">아직 추가된 구문이 없어요.<br />노트 탭에서 추가해보세요!</p>
      </div>
    </div>
  );
}
