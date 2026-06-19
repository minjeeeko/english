import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { listEntries } from "./lib/entries";
import type { Entry } from "./lib/entries";
import { listProgress } from "./lib/progress";
import type { Progress } from "./lib/progress";
import { TabBar } from "./components/TabBar";
import { requestNotificationPermission, scheduleNotifications } from "./lib/notifications";
import { useFontSize } from "./lib/fontsize";

function todayStr() {
  return new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

const TAB_H = 48;

export default function App({ nickname }: { nickname: string }) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [inputDraft, setInputDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const { fontSize, toggle: toggleFontSize } = useFontSize();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const [all, prog] = await Promise.all([
        listEntries({ sort: "created_at" }),
        listProgress(nickname),
      ]);
      const progMap = new Map<string, Progress>(prog.map((p) => [p.entry_id, p]));
      const today = new Date().toISOString().slice(0, 10);
      // sort: due today or overdue first, then rest
      const sorted = [...all].sort((a, b) => {
        const da = progMap.get(a.id)?.due_date ?? today;
        const db = progMap.get(b.id)?.due_date ?? today;
        return da.localeCompare(db);
      });
      setEntries(sorted);
    } finally {
      setLoading(false);
    }
  }, [nickname]);

  useEffect(() => {
    fetchEntries();
    requestNotificationPermission().then((granted) => {
      if (granted) scheduleNotifications();
    });
  }, [fetchEntries]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [submitted, showAnswer, quizIndex]);

  const entry = entries[quizIndex] ?? null;
  const total = entries.length;
  const fs = fontSize === "large";

  const handleSend = () => {
    if (!inputDraft.trim()) return;
    setUserAnswer(inputDraft.trim());
    setInputDraft("");
    setSubmitted(true);
    if (inputRef.current) inputRef.current.style.height = "40px";
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
    if (inputRef.current) inputRef.current.style.height = "40px";
  };
  const goPrev = () => {
    setQuizIndex((i) => (i - 1 + Math.max(total, 1)) % Math.max(total, 1));
    setSubmitted(false);
    setShowAnswer(false);
    setUserAnswer("");
    setInputDraft("");
    if (inputRef.current) inputRef.current.style.height = "40px";
  };

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100dvh",
        paddingBottom: `calc(${TAB_H}px + env(safe-area-inset-bottom))`,
        background: "#b2c7d9",
      }}
    >
      {/* ── HEADER ── */}
      <header className="flex-shrink-0 bg-[#3c3c3c] px-4 pt-3 pb-2">
        {/* Row 1: title + controls */}
        <div className="flex items-center justify-between">
          <span className={`font-[700] text-white ${fs ? "text-[20px]" : "text-[17px]"}`}>
            햄글리시 🐹
          </span>
          <div className="flex items-center gap-2">
            {/* Font size toggle */}
            <button
              onClick={toggleFontSize}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-[600] transition-colors
                ${fs
                  ? "bg-[#fee500] border-[#fee500] text-[#1c1c1e]"
                  : "bg-transparent border-[#666] text-[#aaa]"}`}
            >
              <span style={{ fontSize: "13px" }}>가</span>
              <span style={{ fontSize: "10px" }}>가</span>
              <span className="ml-0.5">{fs ? "확대" : "기본"}</span>
            </button>
          </div>
        </div>
        {/* Row 2: date + progress */}
        <div className="flex items-center gap-3 mt-2">
          <span className={`text-[#aaa] flex-shrink-0 ${fs ? "text-[13px]" : "text-[11px]"}`}>
            {todayStr()}
          </span>
          {!loading && total > 0 && (
            <>
              <div className="flex-1 h-[4px] rounded-full bg-[#555] overflow-hidden">
                <div
                  className="h-full bg-[#fee500] rounded-full transition-all duration-300"
                  style={{ width: `${((quizIndex + 1) / total) * 100}%` }}
                />
              </div>
              <span className={`text-[#aaa] flex-shrink-0 ${fs ? "text-[13px]" : "text-[11px]"}`}>
                {quizIndex + 1} / {total}
              </span>
            </>
          )}
        </div>
      </header>

      {/* ── CHAT MESSAGES (scrollable) ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <span className={`text-white/70 ${fs ? "text-[16px]" : "text-[13px]"}`}>불러오는 중…</span>
          </div>
        ) : entries.length === 0 ? (
          <EmptyState fs={fs} />
        ) : entry && (
          <>
            <HamBubble fs={fs}>
              <p className={`font-[600] text-[#1c1c1e] ${fs ? "text-[17px]" : "text-[14px]"}`}>
                안녕! 오늘도 한 입 🐾
              </p>
              <p className={`text-[#6b6f7e] mt-0.5 ${fs ? "text-[15px]" : "text-[13px]"}`}>
                이 구문으로 예문을 만들어줘!
              </p>
            </HamBubble>

            <HamBubble fs={fs}>
              <div
                className="cursor-pointer active:opacity-80 transition-opacity"
                onClick={() => navigate(`/study/${entry.id}`, { state: { entry } })}
              >
                <p className={`font-[600] text-[#34b3e0] uppercase tracking-wider mb-1.5 ${fs ? "text-[13px]" : "text-[11px]"}`}>
                  오늘의 구문
                </p>
                <p className={`font-[800] text-[#1c1c1e] leading-tight ${fs ? "text-[26px]" : "text-[22px]"}`}>
                  {entry.phrase}
                </p>
                {entry.translation && (
                  <p className={`text-[#6b6f7e] mt-1 ${fs ? "text-[16px]" : "text-[13px]"}`}>
                    {entry.translation}
                  </p>
                )}
                <p className={`text-[#a5a8b5] mt-2 ${fs ? "text-[13px]" : "text-[11px]"}`}>
                  탭해서 영상으로 학습 →
                </p>
              </div>
            </HamBubble>

            <HamBubble fs={fs}>
              <p className={`text-[#1c1c1e] ${fs ? "text-[16px]" : "text-[14px]"}`}>
                위 구문을 사용해서 예문을 써봐! 😊
              </p>
            </HamBubble>

            {submitted && (
              <div className="flex justify-end animate-fadeSlideIn">
                <div className="max-w-[78%] bg-[#fee500] rounded-[18px] rounded-tr-[4px] px-4 py-2.5 shadow-subtle">
                  <p className={`text-[#1c1c1e] leading-relaxed whitespace-pre-wrap ${fs ? "text-[16px]" : "text-[14px]"}`}>
                    {userAnswer}
                  </p>
                </div>
              </div>
            )}

            {submitted && !showAnswer && (
              <HamBubble fs={fs}>
                <p className={`text-[#1c1c1e] ${fs ? "text-[16px]" : "text-[14px]"}`}>
                  잘 썼어! 모범 답안도 볼래? 👀
                </p>
                <button
                  className={`mt-2 font-[600] text-[#34b3e0] underline underline-offset-2 ${fs ? "text-[15px]" : "text-[13px]"}`}
                  onClick={() => setShowAnswer(true)}
                >
                  모범 답안 보기
                </button>
              </HamBubble>
            )}

            {showAnswer && (
              <HamBubble fs={fs}>
                <p className={`font-[600] text-[#34b3e0] uppercase tracking-wider mb-1.5 ${fs ? "text-[13px]" : "text-[11px]"}`}>
                  햄글리의 예문
                </p>
                {entry.example ? (
                  <>
                    <p className={`font-[700] text-[#1c1c1e] leading-relaxed ${fs ? "text-[16px]" : "text-[14px]"}`}>
                      "{entry.example}"
                    </p>
                    {entry.example_translation && (
                      <p className={`text-[#6b6f7e] mt-1 ${fs ? "text-[14px]" : "text-[12px]"}`}>
                        {entry.example_translation}
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`text-[#a5a8b5] ${fs ? "text-[15px]" : "text-[13px]"}`}>
                    등록된 모범 답안이 없어요.
                  </p>
                )}
              </HamBubble>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* ── PREV / NEXT ── */}
      {!loading && total > 0 && (
        <div className="flex-shrink-0 flex gap-2 px-3 py-2 bg-[#b2c7d9]">
          <button
            onClick={goPrev}
            className={`flex-1 py-2 rounded-full bg-white/80 font-[600] text-[#555a6a] active:bg-white/60 transition-colors ${fs ? "text-[15px]" : "text-[13px]"}`}
          >
            ‹ 이전 문제
          </button>
          <button
            onClick={goNext}
            className={`flex-1 py-2 rounded-full bg-[#fee500] font-[600] text-[#1c1c1e] active:bg-[#fcd600] transition-colors ${fs ? "text-[15px]" : "text-[13px]"}`}
          >
            다음 문제 ›
          </button>
        </div>
      )}

      {/* ── CHAT INPUT BAR ── */}
      {!loading && total > 0 && (
        <div
          className="flex-shrink-0 bg-[#f0f0f0] border-t border-[#d0d0d0] px-3 py-2 flex items-end gap-2"
          style={{ paddingBottom: `max(8px, env(safe-area-inset-bottom))` }}
        >
          <textarea
            ref={inputRef}
            className={`flex-1 bg-white rounded-[20px] px-4 py-2.5 text-[#1c1c1e] placeholder-[#a5a8b5] resize-none focus:outline-none leading-relaxed ${fs ? "text-[16px]" : "text-[14px]"}`}
            style={{ minHeight: "40px", maxHeight: "120px", height: "40px" }}
            rows={1}
            placeholder="예문을 써보세요…"
            value={inputDraft}
            onChange={(e) => {
              setInputDraft(e.target.value);
              e.target.style.height = "40px";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!inputDraft.trim()}
            className="w-9 h-9 rounded-full bg-[#fee500] disabled:bg-[#e0e0e0] flex items-center justify-center flex-shrink-0 active:scale-95 transition-all self-end mb-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* ── TAB BAR ── */}
      <TabBar tabH={TAB_H} />
    </div>
  );
}

function HamBubble({ children, fs }: { children: React.ReactNode; fs: boolean }) {
  return (
    <div className="flex items-start gap-2 animate-fadeSlideIn">
      <div className="flex-shrink-0 mt-1 leading-none" style={{ fontSize: fs ? "32px" : "26px" }}>
        🐹
      </div>
      <div className="max-w-[78%]">
        <p className={`font-[500] text-white/80 mb-1 ${fs ? "text-[13px]" : "text-[11px]"}`}>햄글리</p>
        <div className="bg-white rounded-[18px] rounded-tl-[4px] px-4 py-2.5 shadow-subtle">
          {children}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ fs }: { fs: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <span style={{ fontSize: "56px" }}>🐹</span>
      <div className="bg-white/80 rounded-[18px] px-5 py-3 text-center">
        <p className={`text-[#555a6a] ${fs ? "text-[17px]" : "text-[14px]"}`}>
          아직 추가된 구문이 없어요.<br />노트 탭에서 추가해보세요!
        </p>
      </div>
    </div>
  );
}
