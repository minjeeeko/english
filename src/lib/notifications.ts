import { pickPhrase } from "./entries";

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

async function fireNotification() {
  if (Notification.permission !== "granted") return;
  const entry = await pickPhrase();
  if (!entry) return;
  const body = entry.translation ? `${entry.phrase}\n${entry.translation}` : entry.phrase;
  new Notification("햄글리시 🐹", { body, icon: "/icon-192.png" });
}

function scheduleHour(hour: number) {
  const ms = msUntilNextHour(hour);
  setTimeout(async () => {
    await fireNotification();
    scheduleHour(hour); // reschedule for same hour next day
  }, ms);
}

export function scheduleNotifications() {
  for (const hour of NOTIFY_HOURS) {
    scheduleHour(hour);
  }
}
