"use server";

import { redirect } from "next/navigation";
import { dinServer } from "@/lib/supabase";

export async function iesi(): Promise<void> {
  const db = await dinServer();
  await db.auth.signOut();
  redirect("/admin/intrare");
}
