import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mascot } from "./components/Mascot";
import { pickPhrase } from "./lib/entries";
import type { Entry } from "./lib/entries";

const ENCOURAGEMENTS = [
  "오늘도 파이팅! 🌟",
  "꾸준히 하면 돼요! 💪",
  "잘하고 있어요! ☀️",
  "영어 실력 쑥쑥! 🌱",
  "한 문장씩 늘어나고 있어요 🎉",
  "포기하지 마요! 응원해요 🐹",
  "오늘도 열심히! ✨",
];

type BubbleContent =
  | { kind: "phrase"; entry: Entry }
  | { kind: "cheer"; message: string };

export default function App() {
  const navigate = useNavigate();
  const [bubble, setBubble] = useState<BubbleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [petted, setPetted] = useState(false);

  const fetchBubble = useCallback(async () => {
    setLoading(true);
    try {
      // 25% chance to show encouragement
      if (Math.random() < 0.25) {
        const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        setBubble({ kind: "cheer", message: msg });
      } else {
        const e = await pickPhrase();
        if (e) setBubble({ kind: "phrase", entry: e });
        else setBubble({ kind: "cheer", message: ENCOURAGEMENTS[0] });
      }
      setBubbleKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBubble();
  }, [fetchBubble]);

  const handlePet = () => {
    if (petted) return;
    setPetted(true);
    setTimeout(() => setPetted(false), 1500);
  };

  const handleBubbleClick = () => {
    if (bubble?.kind === "phrase") navigate(`/study/${bubble.entry.id}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#f0f9ff]">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-4 w-full max-w-sm">
        {/* Speech bubble */}
        {!loading && bubble ? (
          <div
            key={bubbleKey}
            className={`animate-fadeSlideIn w-full ${bubble.kind === "phrase" ? "cursor-pointer" : ""}`}
            onClick={handleBubbleClick}
          >
            {bubble.kind === "phrase" ? (
              <PhraseBubble entry={bubble.entry} />
            ) : (
              <CheerBubble message={bubble.message} />
            )}
          </div>
        ) : !loading ? (
          <div key={bubbleKey} className="animate-fadeSlideIn w-full">
            <div className="relative bg-white text-stone-800 rounded-2xl p-4 shadow-md border border-sky-100 text-center">
              <p className="text-base font-medium text-stone-500">아직 추가된 구문이 없어요</p>
              <p className="text-sm text-sky-400 mt-1">우측 하단 + 버튼으로 구문을 추가해보세요!</p>
              <BubbleTail />
            </div>
          </div>
        ) : (
          <div className="h-24" />
        )}

        {/* Mascot */}
        <Mascot petted={petted} onClick={handlePet} />

        {/* Next bubble button */}
        {!loading && (
          <button
            onClick={fetchBubble}
            className="mt-1 text-sm text-sky-500 hover:text-sky-700 transition-colors border border-sky-200 rounded-full px-4 py-1.5 bg-white shadow-sm active:scale-95"
          >
            다른 예문 보기
          </button>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-6 flex flex-col items-end gap-3 z-20">
        {fabOpen && (
          <>
            <button
              onClick={() => { setFabOpen(false); navigate("/all"); }}
              className="flex items-center gap-2 bg-white text-stone-700 px-4 py-2 rounded-full shadow-lg text-sm animate-fadeSlideIn border border-stone-200 hover:bg-stone-50 active:scale-95 transition-all"
            >
              📚 전체 구문 보기
            </button>
            <button
              onClick={() => { setFabOpen(false); navigate("/add"); }}
              className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full shadow-lg text-sm animate-fadeSlideIn hover:bg-sky-600 active:scale-95 transition-all"
            >
              ✏️ 구문 추가하기
            </button>
          </>
        )}
        <button
          onClick={() => setFabOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-sky-500 text-white shadow-xl flex items-center justify-center text-2xl font-light hover:bg-sky-600 active:scale-95 transition-all"
        >
          {fabOpen ? "×" : "+"}
        </button>
      </div>
    </div>
  );
}

function BubbleTail() {
  return (
    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
  );
}

function PhraseBubble({ entry }: { entry: Entry }) {
  return (
    <div className="relative bg-white text-stone-800 rounded-2xl p-4 shadow-md border border-sky-100 active:scale-[0.98] transition-transform ring-2 ring-sky-200 ring-offset-2 ring-offset-[#f0f9ff] animate-pulse-ring">
      <p className="text-lg font-bold leading-snug mb-1">{entry.phrase}</p>
      {entry.translation && (
        <p className="text-sm text-stone-500">{entry.translation}</p>
      )}
      <BubbleTail />
    </div>
  );
}

function CheerBubble({ message }: { message: string }) {
  return (
    <div className="relative bg-sky-50 text-sky-700 rounded-2xl p-4 shadow-md border border-sky-200 text-center">
      <p className="text-base font-semibold">{message}</p>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-sky-50" />
    </div>
  );
}
