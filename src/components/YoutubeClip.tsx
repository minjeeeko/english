import { useEffect, useRef } from "react";

let apiReady: Promise<void> | null = null;

function loadYT(): Promise<void> {
  if (apiReady) return apiReady;
  apiReady = new Promise((resolve) => {
    if ((window as any).YT?.Player) return resolve();
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    (window as any).onYouTubeIframeAPIReady = () => resolve();
  });
  return apiReady;
}

type Props = { videoId: string; start?: number; end?: number; loop?: boolean };

export function YoutubeClip({ videoId, start = 0, end, loop = false }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadYT().then(() => {
      if (cancelled || !elRef.current) return;
      playerRef.current = new (window as any).YT.Player(elRef.current, {
        videoId,
        playerVars: { start, end, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e: any) => {
            if (loop && end && e.data === (window as any).YT.PlayerState.PLAYING) {
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = window.setInterval(() => {
                const t = playerRef.current?.getCurrentTime?.() ?? 0;
                if (t >= end) playerRef.current.seekTo(start, true);
              }, 250);
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      playerRef.current?.destroy?.();
    };
  }, [videoId, start, end, loop]);

  const replay = () => {
    playerRef.current?.seekTo(start, true);
    playerRef.current?.playVideo();
  };

  return (
    <div className="space-y-2">
      <div className="aspect-video w-full overflow-hidden rounded-xl">
        <div ref={elRef} className="h-full w-full" />
      </div>
      <button
        onClick={replay}
        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 active:scale-95 transition-transform"
      >
        ⟲ 구간 다시 듣기
      </button>
    </div>
  );
}
