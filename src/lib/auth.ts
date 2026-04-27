import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  uid: string;
  email: string;
  plan: "free" | "pro" | "business";
  searchesToday: number;
  lastSearchDate: string;
  stripeCustomerId?: string;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== uid) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, stripe_customer_id")
    .eq("id", uid)
    .maybeSingle();

  const plan = (profile?.plan ?? "free") as "free" | "pro" | "business";

  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await supabase
    .from("search_usage")
    .select("count, date")
    .eq("user_id", uid)
    .eq("date", today)
    .maybeSingle();

  return {
    uid,
    email: user.email ?? "",
    plan,
    searchesToday: usage?.count ?? 0,
    lastSearchDate: usage?.date ?? "",
    stripeCustomerId: profile?.stripe_customer_id ?? undefined,
  };
}

export async function canSearch(uid: string): Promise<boolean> {
  const profile = await getProfile(uid);
  if (!profile) return false;
  if (profile.plan === "pro" || profile.plan === "business") return true;
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastSearchDate !== today) return true;
  return profile.searchesToday < 5;
}

export async function recordSearch(uid: string) {
  await supabase.rpc("increment_search_count", { user_uuid: uid });
}
