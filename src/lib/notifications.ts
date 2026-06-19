import { listEntries } from "./entries";
import { listProgress } from "./progress";
import { getNickname } from "./nickname";

const NOTIFY_HOURS = [9, 13, 15, 20, 22];

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function msUntilNextHour(hour: number): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

async function pickPhrase() {
  try {
    const nickname = getNickname();
    const [all, prog] = await Promise.all([
      listEntries({ sort: "created_at" }),
      nickname ? listProgress(nickname) : Promise.resolve([]),
    ]);
    const progMap = new Map(prog.map((p) => [p.entry_id, p]));
    const today = new Date().toISOString().slice(0, 10);
    const due = all.filter((e) => (progMap.get(e.id)?.due_date ?? today) <= today);
    const pool = due.length > 0 ? due : all;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  } catch {
    return null;
  }
}

async function fireNotification() {
  if (Notification.permission !== "granted") return;
  const entry = await pickPhrase();
  const title = "햄글리시 🐹";
  const body = entry
    ? entry.translation
      ? `"${entry.phrase}"\n${entry.translation}`
      : `"${entry.phrase}"`
    : "오늘 구문 학습할 시간이에요!";

  const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null;
  if (reg) {
    reg.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "hamglish-study",
    });
  } else {
    new Notification(title, { body, icon: "/icon-192.png" });
  }
}

function scheduleHour(hour: number) {
  const ms = msUntilNextHour(hour);
  setTimeout(async () => {
    await fireNotification();
    scheduleHour(hour);
  }, ms);
}

export function scheduleNotifications() {
  for (const hour of NOTIFY_HOURS) {
    scheduleHour(hour);
  }
}
