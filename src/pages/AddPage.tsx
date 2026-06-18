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
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-800 pb-10">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button onClick={() => navigate("/")} className="mb-4 text-sm text-sky-500 hover:text-sky-700">
          ← 돌아가기
        </button>
        <h1 className="text-xl font-bold mb-5 text-stone-900">구문 추가하기</h1>

        <div className="space-y-4">
          <Field label="영어 구문 *">
            <input className="input-base" placeholder="e.g. It's not my cup of tea." value={phrase} onChange={(e) => setPhrase(e.target.value)} />
          </Field>

          <Field label="구문 해석">
            <input className="input-base" placeholder="e.g. 그건 내 취향이 아니야." value={translation} onChange={(e) => setTranslation(e.target.value)} />
          </Field>

          <div className="bg-white rounded-xl border border-sky-100 p-4 space-y-3 shadow-sm">
            <p className="text-xs font-semibold text-sky-500 uppercase tracking-wide">예문</p>
            <Field label="영어 예문">
              <input className="input-base" placeholder="e.g. That kind of music is not my cup of tea." value={example} onChange={(e) => setExample(e.target.value)} />
            </Field>
            <Field label="예문 해석">
              <input className="input-base" placeholder="e.g. 그런 음악은 내 취향이 아니야." value={exampleTranslation} onChange={(e) => setExampleTranslation(e.target.value)} />
            </Field>
          </div>

          <Field label="상세 설명 (마크다운)">
            <textarea className="input-base h-24 resize-none" placeholder="뉘앙스, 사용 맥락 등..." value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          </Field>

          <Field label="유튜브 링크">
            <input className="input-base" placeholder="https://youtu.be/..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          </Field>

          {preview && (
            <YoutubeClip videoId={preview.id} start={preview.start} end={endSec ? parseInt(endSec, 10) : undefined} />
          )}

          <div className="flex gap-3">
            <Field label="시작(초)" className="flex-1">
              <input className="input-base" type="number" placeholder="0" value={startSec} onChange={(e) => setStartSec(e.target.value)} />
            </Field>
            <Field label="끝(초)" className="flex-1">
              <input className="input-base" type="number" placeholder="" value={endSec} onChange={(e) => setEndSec(e.target.value)} />
            </Field>
          </div>
          {endSec && <p className="text-xs text-emerald-500">✓ 구간 반복 가능</p>}

          <Field label="태그 (쉼표 구분)">
            <input className="input-base" placeholder="idiom, business, ..." value={tags} onChange={(e) => setTags(e.target.value)} />
          </Field>

          <button
            onClick={handleSave}
            disabled={!phrase.trim() || saving}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white rounded-xl py-3 font-semibold active:scale-95 transition-all mt-2 shadow-sm"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm text-stone-500 mb-1 font-medium">{label}</label>
      {children}
    </div>
  );
}
