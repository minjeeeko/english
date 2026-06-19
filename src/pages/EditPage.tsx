import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEntry, updateEntry, deleteEntry } from "../lib/entries";
import { parseYoutube } from "../lib/youtube";
import { YoutubeClip } from "../components/YoutubeClip";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
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
    if (!id) return;
    getEntry(id).then((e) => {
      if (!e) return;
      setPhrase(e.phrase);
      setTranslation(e.translation ?? "");
      setExample(e.example ?? "");
      setExampleTranslation(e.example_translation ?? "");
      setExplanation(e.explanation ?? "");
      setYoutubeUrl(e.youtube_url ?? "");
      setStartSec(e.start_seconds != null ? String(e.start_seconds) : "");
      setEndSec(e.end_seconds != null ? String(e.end_seconds) : "");
      setTags(e.tags.join(", "));
    });
  }, [id]);

  useEffect(() => {
    if (!youtubeUrl) { setPreview(null); return; }
    const { id: vid, start } = parseYoutube(youtubeUrl);
    if (vid) setPreview({ id: vid, start: start ?? 0 });
    else setPreview(null);
  }, [youtubeUrl]);

  const handleSave = async () => {
    if (!id || !phrase.trim()) return;
    setSaving(true);
    try {
      await updateEntry(id, {
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

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("정말 삭제할까요?")) return;
    await deleteEntry(id);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="flex items-center justify-between px-[18px] py-3 bg-canvas border-b border-hairline">
        <button onClick={() => navigate(-1)} className="text-[14px] text-steel font-[500] active:text-ink">
          ✕ 닫기
        </button>
        <span className="text-[16px] font-[700] text-ink">구문 편집</span>
        <div className="w-12" />
      </header>

      <div className="max-w-lg mx-auto px-[18px] py-[16px] pb-[120px] flex flex-col gap-[16px]">
        <Field label="유튜브 영상 링크">
          <input className="input-base" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
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
          <input className="input-base" value={phrase} onChange={(e) => setPhrase(e.target.value)} />
        </Field>
        <Field label="해석">
          <input className="input-base" value={translation} onChange={(e) => setTranslation(e.target.value)} />
        </Field>
        <Field label="상세 설명">
          <textarea className="input-base resize-none py-3" rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        </Field>

        <div className="bg-accent-lite rounded-xl border border-hairline-soft p-4 flex flex-col gap-3">
          <p className="text-[13px] font-[600] text-accent-deep">예문 · 예문 해석</p>
          <Field label="예문 (영어)">
            <input className="input-base" value={example} onChange={(e) => setExample(e.target.value)} />
          </Field>
          <Field label="예문 해석 (한국어)">
            <input className="input-base" value={exampleTranslation} onChange={(e) => setExampleTranslation(e.target.value)} />
          </Field>
        </div>

        <div className="flex gap-3">
          <Field label="시작(초)" className="flex-1">
            <input className="input-base" type="number" value={startSec} onChange={(e) => setStartSec(e.target.value)} />
          </Field>
          <Field label="끝(초)" className="flex-1">
            <input className="input-base" type="number" value={endSec} onChange={(e) => setEndSec(e.target.value)} />
          </Field>
        </div>

        <Field label="태그 (쉼표 구분)">
          <input className="input-base" value={tags} onChange={(e) => setTags(e.target.value)} />
        </Field>

        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-full border border-[#e0b0b0] text-[#c0392b] text-[14px] font-[500] bg-canvas active:bg-red-50 transition-colors mt-2"
        >
          🗑 삭제
        </button>
      </div>

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
