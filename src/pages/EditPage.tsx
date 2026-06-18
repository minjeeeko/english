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
      navigate("/");
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
    <div className="min-h-screen bg-[#f0f9ff] text-stone-800 pb-10">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-sky-500 hover:text-sky-700">
          ← 돌아가기
        </button>
        <h1 className="text-xl font-bold mb-5 text-stone-900">구문 편집</h1>

        <div className="space-y-4">
          <Field label="영어 구문 *">
            <input className="input-base" value={phrase} onChange={(e) => setPhrase(e.target.value)} />
          </Field>
          <Field label="구문 해석">
            <input className="input-base" value={translation} onChange={(e) => setTranslation(e.target.value)} />
          </Field>

          <div className="bg-white rounded-xl border border-sky-100 p-4 space-y-3 shadow-sm">
            <p className="text-xs font-semibold text-sky-500 uppercase tracking-wide">예문</p>
            <Field label="영어 예문">
              <input className="input-base" value={example} onChange={(e) => setExample(e.target.value)} />
            </Field>
            <Field label="예문 해석">
              <input className="input-base" value={exampleTranslation} onChange={(e) => setExampleTranslation(e.target.value)} />
            </Field>
          </div>

          <Field label="상세 설명 (마크다운)">
            <textarea className="input-base h-24 resize-none" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          </Field>
          <Field label="유튜브 링크">
            <input className="input-base" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          </Field>
          {preview && (
            <YoutubeClip videoId={preview.id} start={preview.start} end={endSec ? parseInt(endSec, 10) : undefined} />
          )}
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
            onClick={handleSave}
            disabled={!phrase.trim() || saving}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white rounded-xl py-3 font-semibold active:scale-95 transition-all shadow-sm"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            onClick={handleDelete}
            className="w-full bg-white hover:bg-rose-50 text-rose-500 border border-rose-200 rounded-xl py-3 font-semibold active:scale-95 transition-all"
          >
            🗑 삭제
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
