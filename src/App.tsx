import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mascot } from "./components/Mascot";
import { pickPhrase } from "./lib/entries";
import type { Entry } from "./lib/entries";
import { requestNotificationPermission, scheduleNotifications } from "./lib/notifications";

const CHEERS = [
  "영어 공부를 하다니 대단한데?! 🌟",
  "그만 만지고 공부하자 😤",
  "끼양 🐹",
  "오늘도 열심히! 💪",
  "영어 실력이 쑥쑥! 🌱",
];

export default function App() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [petted, setPetted] = useState(false);
  const [cheerMsg, setCheerMsg] = useState<string | null>(null);

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
    requestNotificationPermission().then((granted) => {
      if (granted) scheduleNotifications();
    });
  }, [fetchPhrase]);

  const handlePet = () => {
    if (petted) return;
    setPetted(true);
    const msg = CHEERS[Math.floor(Math.random() * CHEERS.length)];
    setCheerMsg(msg);
    setBubbleKey((k) => k + 1);
    setTimeout(() => {
      setPetted(false);
      setCheerMsg(null);
      setBubbleKey((k) => k + 1);
    }, 2200);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Subtle background blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-sky-50 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-sm -mt-12">
        {/* Speech bubble */}
        <div className="w-full mb-2">
          {!loading ? (
            <div key={bubbleKey} className="animate-fadeSlideIn w-full">
              {cheerMsg ? (
                <div className="bg-white text-stone-800 rounded-2xl p-4 shadow-md border border-sky-100 text-center">
                  <p className="text-base font-semibold">{cheerMsg}</p>
                </div>
              ) : entry ? (
                <div
                  className="bg-white text-stone-800 rounded-2xl p-4 shadow-md border border-sky-100 cursor-pointer active:scale-[0.98] transition-transform animate-pulse-ring"
                  onClick={() => navigate(`/study/${entry.id}`, { state: { entry } })}
                >
                  <p className="text-lg font-bold leading-snug mb-1">{entry.phrase}</p>
                  {entry.translation && (
                    <p className="text-sm text-stone-500">{entry.translation}</p>
                  )}
                </div>
              ) : (
                <div className="bg-white text-stone-800 rounded-2xl p-4 shadow-md border border-sky-100 text-center">
                  <p className="text-base font-medium text-stone-500">아직 추가된 구문이 없어요</p>
                  <p className="text-sm text-sky-400 mt-1">우측 하단 + 버튼으로 추가해보세요!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-24" />
          )}
        </div>

        {/* Mascot + button pushed lower */}
        <div className="flex flex-col items-center gap-3 mt-16">
          <Mascot petted={petted} onClick={handlePet} />

          {!loading && !cheerMsg && (
            <button
              onClick={fetchPhrase}
              className="text-sm text-sky-500 hover:text-sky-700 transition-colors border border-sky-200 rounded-full px-4 py-1.5 bg-white shadow-sm active:scale-95"
            >
              다른 예문 보기
            </button>
          )}
        </div>
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
