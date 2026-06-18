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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#faf9f7]">
      {/* Soft background blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-4 w-full max-w-sm">
        {/* Speech bubble */}
        {!loading && entry ? (
          <div
            key={bubbleKey}
            className="animate-fadeSlideIn cursor-pointer w-full"
            onClick={() => navigate(`/study/${entry.id}`)}
          >
            <div className="relative bg-white text-stone-800 rounded-2xl p-4 shadow-md border border-stone-100 active:scale-[0.98] transition-transform">
              <p className="text-lg font-bold leading-snug mb-1">{entry.phrase}</p>
              {entry.translation && (
                <p className="text-sm text-stone-500">{entry.translation}</p>
              )}
              <p className="text-xs text-indigo-400 mt-2 font-medium">탭하면 영상으로 학습 →</p>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
            </div>
          </div>
        ) : !loading && !entry ? (
          <div key={bubbleKey} className="animate-fadeSlideIn w-full">
            <div className="relative bg-white text-stone-800 rounded-2xl p-4 shadow-md border border-stone-100 text-center">
              <p className="text-base font-medium text-stone-500">아직 추가된 구문이 없어요</p>
              <p className="text-sm text-indigo-400 mt-1">
                우측 하단 + 버튼으로 구문을 추가해보세요!
              </p>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
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
            className="mt-1 text-sm text-indigo-400 hover:text-indigo-600 transition-colors border border-indigo-200 rounded-full px-4 py-1.5 bg-white shadow-sm active:scale-95"
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
              className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg text-sm animate-fadeSlideIn hover:bg-indigo-600 active:scale-95 transition-all"
            >
              ✏️ 구문 추가하기
            </button>
          </>
        )}
        <button
          onClick={() => setFabOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-indigo-500 text-white shadow-xl flex items-center justify-center text-2xl font-light hover:bg-indigo-600 active:scale-95 transition-all"
        >
          {fabOpen ? "×" : "+"}
        </button>
      </div>
    </div>
  );
}
