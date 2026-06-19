import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEntry } from "../lib/entries";
import { parseYoutube } from "../lib/youtube";
import { YoutubeClip } from "../components/YoutubeClip";

export default function AddPage() {
  const navigate = useNavigate();
  const [phrase, setPhrase] = useState("");
  const [translation, setTranslation] = useState("");
  const [example, setExample] = useState("");
  const [exampleTranslation, setExampleTranslation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [startSec, setStartSec] = useState("");
  const [endSec, setEndSec] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<{ id: string; start: number } | null>(null);

  useEffect(() => {
    if (!youtubeUrl) { setPreview(null); return; }
    const { id, start } = parseYoutube(youtubeUrl);
    if (id) {
      setPreview({ id, start: start ?? 0 });
      if (start !== null && !startSec) setStartSec(String(start));
    } else {
      setPreview(null);
    }
  }, [youtubeUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!phrase.trim()) return;
    setSaving(true);
    try {
      await createEntry({
        phrase: phrase.trim(),
        translation: translation.trim() || null,
        example: example.trim() || null,
        example_translation: exampleTranslation.trim() || null,
        explanation: explanation.trim() || null,
        youtube_url: youtubeUrl.trim() || null,
        start_seconds: startSec ? parseInt(startSec, 10) : null,
        end_seconds: endSec ? parseInt(endSec, 10) : null,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Header */}
      <header className="flex items-center justify-between px-[18px] py-3 bg-canvas border-b border-hairline">
        <button
          onClick={() => navigate(-1)}
          className="text-[14px] text-steel font-[500] active:text-ink"
        >
          ✕ 닫기
        </button>
        <span className="text-[16px] font-[700] text-ink">구문 추가</span>
        <span className={`text-[14px] font-[500] ${phrase.trim() ? "text-accent" : "text-muted"}`}>저장</span>
      </header>

      <div className="max-w-lg mx-auto px-[18px] py-[16px] pb-[100px] flex flex-col gap-[16px]">
        <Field label="유튜브 영상 링크">
          <input className="input-base" placeholder="https://youtu.be/…" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          {preview ? (
            <div className="mt-2 rounded-xl overflow-hidden">
              <YoutubeClip videoId={preview.id} start={preview.start} end={endSec ? parseInt(endSec, 10) : undefined} />
            </div>
          ) : (
            <div className="mt-2 aspect-video w-full rounded-xl border border-dashed border-hairline-strong bg-surface flex items-center justify-center text-[13px] text-muted">
              붙여넣으면 미리보기 ✎
            </div>
          )}
        </Field>

        <Field label="구문 *">
          <input className="input-base" placeholder="break the ice" value={phrase} onChange={(e) => setPhrase(e.target.value)} />
        </Field>

        <Field label="해석">
          <input className="input-base" placeholder="어색함을 깨다" value={translation} onChange={(e) => setTranslation(e.target.value)} />
        </Field>

        <Field label="상세 설명">
          <textarea className="input-base resize-none py-3" rows={3} placeholder="뉘앙스, 사용 맥락 등…" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        </Field>

        <div className="bg-accent-lite rounded-xl border border-hairline-soft p-4 flex flex-col gap-3">
          <p className="text-[13px] font-[600] text-accent-deep">예문 · 예문 해석</p>
          <Field label="예문 (영어)">
            <input className="input-base" placeholder="That kind of music is not my cup of tea." value={example} onChange={(e) => setExample(e.target.value)} />
          </Field>
          <Field label="예문 해석 (한국어)">
            <input className="input-base" placeholder="그런 음악은 내 취향이 아니야." value={exampleTranslation} onChange={(e) => setExampleTranslation(e.target.value)} />
          </Field>
        </div>

        <div className="flex gap-3">
          <Field label="시작(초)" className="flex-1">
            <input className="input-base" type="number" placeholder="0" value={startSec} onChange={(e) => setStartSec(e.target.value)} />
          </Field>
          <Field label="끝(초)" className="flex-1">
            <input className="input-base" type="number" placeholder="–" value={endSec} onChange={(e) => setEndSec(e.target.value)} />
          </Field>
        </div>

        <Field label="태그 (쉼표 구분)">
          <input className="input-base" placeholder="idiom, business, …" value={tags} onChange={(e) => setTags(e.target.value)} />
        </Field>
      </div>

      {/* Fixed save button */}
      <div className="fixed bottom-0 left-0 right-0 bg-canvas border-t border-hairline px-[18px] py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <button
          onClick={handleSave}
          disabled={!phrase.trim() || saving}
          className="btn-primary w-full py-3.5 text-[15px] disabled:opacity-40"
        >
          {saving ? "저장 중…" : "저장하기"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[13px] font-[600] text-slate mb-1.5">{label}</label>
      {children}
    </div>
  );
}
