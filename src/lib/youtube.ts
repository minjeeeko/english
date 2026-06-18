export function parseYoutube(url: string): { id: string | null; start: number | null } {
  const id =
    url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
    )?.[1] ?? null;
  let start: number | null = null;
  const t = url.match(/[?&#](?:t|start)=([0-9hms]+)/i)?.[1];
  if (t) {
    if (/^\d+s?$/.test(t)) start = parseInt(t, 10);
    else {
      const h = +(t.match(/(\d+)h/)?.[1] ?? 0);
      const m = +(t.match(/(\d+)m/)?.[1] ?? 0);
      const s = +(t.match(/(\d+)s/)?.[1] ?? 0);
      start = h * 3600 + m * 60 + s;
    }
  }
  return { id, start };
}
