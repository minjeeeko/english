const KEY = "hamglish_nickname";

export function getNickname(): string | null {
  try { return localStorage.getItem(KEY); }
  catch { return null; }
}

export function setNickname(name: string): void {
  try { localStorage.setItem(KEY, name.trim()); }
  catch {}
}
