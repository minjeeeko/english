import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mascot } from "./components/Mascot";
import { pickPhrase } from "./lib/entries";
import type { Entry } from "./lib/entries";

export default function App() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [bubbleKey, setBubbleKey] = useState(0);

  const fetchPhrase = useCallback(async () => {
    setLoading(true);
    try {
      const e = await pickPhrase();
      setEntry(e);
      setBubbleKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhrase();
  }, [fetchPhrase]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/30 to-slate-900 pointer-events-none" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              opacity: 0.15 + (i % 3) * 0.05,
              width: (1 + (i % 3)) + "px",
              height: (1 + (i % 3)) + "px",
              top: ((i * 37) % 100) + "%",
              left: ((i * 53) % 100) + "%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 px-4 w-full max-w-sm">
        {/* Speech bubble */}
        {!loading && entry ? (
          <div
            key={bubbleKey}
            className="animate-fadeSlideIn cursor-pointer w-full"
            onClick={() => navigate(`/study/${entry.id}`)}
          >
            <div className="relative bg-white/95 backdrop-blur text-slate-900 rounded-2xl p-4 shadow-xl active:scale-[0.98] transition-transform">
              <p className="text-lg font-bold leading-snug mb-1">{entry.phrase}</p>
              {entry.translation && (
                <p className="text-sm text-slate-500">{entry.translation}</p>
              )}
              <p className="text-xs text-indigo-500 mt-2">탭하면 영상으로 학습 →</p>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-white/95" />
            </div>
          </div>
        ) : !loading && !entry ? (
          <div key={bubbleKey} className="animate-fadeSlideIn w-full">
            <div className="relative bg-white/95 backdrop-blur text-slate-900 rounded-2xl p-4 shadow-xl text-center">
              <p className="text-base font-medium text-slate-500">아직 추가된 구문이 없어요</p>
              <p className="text-sm text-indigo-500 mt-1">
                우측 하단 + 버튼으로 구문을 추가해보세요!
              </p>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-white/95" />
            </div>
          </div>
        ) : (
          <div className="h-24" />
        )}

        {/* Mascot */}
        <Mascot />

        {/* Next phrase button */}
        {!loading && (
          <button
            onClick={fetchPhrase}
            className="mt-1 text-sm text-indigo-300 hover:text-indigo-100 transition-colors border border-indigo-700/60 rounded-full px-4 py-1.5 active:scale-95"
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
              onClick={() => {
                setFabOpen(false);
                navigate("/all");
              }}
              className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-full shadow-lg text-sm animate-fadeSlideIn hover:bg-slate-600 active:scale-95 transition-all"
            >
              📚 전체 구문 보기
            </button>
            <button
              onClick={() => {
                setFabOpen(false);
                navigate("/add");
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg text-sm animate-fadeSlideIn hover:bg-indigo-500 active:scale-95 transition-all"
            >
              ✏️ 구문 추가하기
            </button>
          </>
        )}
        <button
          onClick={() => setFabOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center text-2xl font-light hover:bg-indigo-500 active:scale-95 transition-all"
        >
          {fabOpen ? "×" : "+"}
        </button>
      </div>
    </div>
  );
}
