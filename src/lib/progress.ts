import { supabase } from "./supabase";

export type Progress = {
  nickname: string;
  entry_id: string;
  srs_box: number;
  due_date: string;
};

const INTERVALS: Record<number, number> = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function calcGrade(current: Progress | null, ok: boolean): { srs_box: number; due_date: string } {
  const prev = current?.srs_box ?? 1;
  const box = ok ? Math.min(prev + 1, 5) : 1;
  return { srs_box: box, due_date: addDays(INTERVALS[box]) };
}

export async function listProgress(nickname: string): Promise<Progress[]> {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("nickname", nickname);
  if (error) throw error;
  return (data ?? []) as Progress[];
}

export async function upsertProgress(
  nickname: string,
  entry_id: string,
  patch: { srs_box: number; due_date: string }
): Promise<void> {
  const { error } = await supabase.from("progress").upsert({
    nickname,
    entry_id,
    ...patch,
  });
  if (error) throw error;
}
