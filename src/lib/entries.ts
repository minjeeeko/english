import { supabase } from "./supabase";

export type Entry = {
  id: string;
  phrase: string;
  translation: string | null;
  example: string | null;
  example_translation: string | null;
  explanation: string | null;
  youtube_url: string | null;
  start_seconds: number | null;
  end_seconds: number | null;
  tags: string[];
  srs_box: number;
  due_date: string;
  review_count: number;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EntryInput = Omit<
  Entry,
  "id" | "created_at" | "updated_at" | "srs_box" | "due_date" | "review_count" | "last_reviewed_at"
>;

const INTERVALS: Record<number, number> = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };

function addDays(d: Date, n: number): string {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
}

export function gradeEntry(e: Entry, ok: boolean) {
  const box = ok ? Math.min(e.srs_box + 1, 5) : 1;
  return {
    srs_box: box,
    due_date: addDays(new Date(), INTERVALS[box]),
    review_count: e.review_count + 1,
    last_reviewed_at: new Date().toISOString(),
  };
}

export async function listEntries({
  search,
  tag,
  sort = "created_at",
}: {
  search?: string;
  tag?: string;
  sort?: "created_at" | "due_date";
}): Promise<Entry[]> {
  let q = supabase.from("entries").select("*");
  if (search) q = q.ilike("phrase", `%${search}%`);
  if (tag) q = q.contains("tags", [tag]);
  if (sort === "due_date") {
    q = q.order("due_date", { ascending: true });
  } else {
    q = q.order("created_at", { ascending: false });
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Entry[];
}

export async function getEntry(id: string): Promise<Entry | null> {
  const { data, error } = await supabase.from("entries").select("*").eq("id", id).single();
  if (error) return null;
  return data as Entry;
}

export async function createEntry(input: EntryInput): Promise<Entry> {
  const { data, error } = await supabase.from("entries").insert(input).select().single();
  if (error) throw error;
  return data as Entry;
}

export async function updateEntry(
  id: string,
  input: Partial<
    EntryInput & {
      srs_box?: number;
      due_date?: string;
      review_count?: number;
      last_reviewed_at?: string | null;
    }
  >
): Promise<Entry> {
  const { data, error } = await supabase
    .from("entries")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Entry;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw error;
}

export async function listDueEntries(): Promise<Entry[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase.from("entries").select("*").lte("due_date", today);
  if (error) throw error;
  return (data ?? []) as Entry[];
}

export async function pickPhrase(): Promise<Entry | null> {
  const due = await listDueEntries();
  const pool = due.length > 0 ? due : await listEntries({});
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
