import { createClient } from "@supabase/supabase-js";
import { EventItem, TaskItem } from "./types";

interface PlannerRow {
  user_id: string;
  tasks: TaskItem[];
  events: EventItem[];
}

interface PlannerPayload {
  tasks: TaskItem[];
  events: EventItem[];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isCloudEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const supabase = isCloudEnabled ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string) : null;

const TABLE_NAME = "planner_profiles";

export const signUpWithEmail = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error("Cloud no configurado");
  }
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw new Error(error.message);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error("Cloud no configurado");
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
};

export const signOutCloud = async () => {
  if (!supabase) {
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  if (!supabase) {
    return null;
  }
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.warn("No se pudo obtener la sesión actual", error.message);
    return null;
  }
  return data.user;
};

const ensurePlannerRow = async (userId: string) => {
  if (!supabase) {
    throw new Error("Cloud no configurado");
  }

  const { data, error } = await supabase.from(TABLE_NAME).select("user_id").eq("user_id", userId).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  if (data) {
    return;
  }

  const { error: insertError } = await supabase
    .from(TABLE_NAME)
    .insert({ user_id: userId, tasks: [], events: [] })
    .select("user_id")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }
};

export const loadPlannerData = async (userId: string): Promise<PlannerPayload> => {
  if (!supabase) {
    return { tasks: [], events: [] };
  }

  await ensurePlannerRow(userId);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("tasks, events")
    .eq("user_id", userId)
    .single<PlannerRow>();

  if (error) {
    throw new Error(error.message);
  }

  return {
    tasks: data.tasks ?? [],
    events: data.events ?? []
  };
};

export const savePlannerData = async (userId: string, payload: PlannerPayload) => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from(TABLE_NAME).upsert(
    {
      user_id: userId,
      tasks: payload.tasks,
      events: payload.events,
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw new Error(error.message);
  }
};
