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
      setExplanation(e.explanation ?? "");
      setYoutubeUrl(e.youtube_url ?? "");
      setStartSec(e.start_seconds != null ? String(e.start_seconds) : "");
      setEndSec(e.end_seconds != null ? String(e.end_seconds) : "");
      setTags(e.tags.join(", "));
    });
  }, [id]);

  useEffect(() => {
    if (!youtubeUrl) {
      setPreview(null);
      return;
    }
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
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-10">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← 돌아가기
        </button>
        <h1 className="text-xl font-bold mb-5">구문 편집</h1>

        <div className="space-y-4">
          <Field label="영어 구문 *">
            <input
              className="input-base"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
            />
          </Field>
          <Field label="해석">
            <input
              className="input-base"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            />
          </Field>
          <Field label="상세 설명 (마크다운)">
            <textarea
              className="input-base h-28 resize-none"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </Field>
          <Field label="유튜브 링크">
            <input
              className="input-base"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </Field>
          {preview && (
            <YoutubeClip
              videoId={preview.id}
              start={preview.start}
              end={endSec ? parseInt(endSec, 10) : undefined}
            />
          )}
          <div className="flex gap-3">
            <Field label="시작(초)" className="flex-1">
              <input
                className="input-base"
                type="number"
                value={startSec}
                onChange={(e) => setStartSec(e.target.value)}
              />
            </Field>
            <Field label="끝(초)" className="flex-1">
              <input
                className="input-base"
                type="number"
                value={endSec}
                onChange={(e) => setEndSec(e.target.value)}
              />
            </Field>
          </div>
          <Field label="태그 (쉼표 구분)">
            <input
              className="input-base"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Field>

          <button
            onClick={handleSave}
            disabled={!phrase.trim() || saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl py-3 font-semibold active:scale-95 transition-all"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            onClick={handleDelete}
            className="w-full bg-rose-800 hover:bg-rose-700 text-white rounded-xl py-3 font-semibold active:scale-95 transition-all"
          >
            🗑 삭제
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  );
}
