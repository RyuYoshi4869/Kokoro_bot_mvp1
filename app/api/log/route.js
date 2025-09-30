import { NextResponse } from "next/server";
import { createServerSupabase } from "../../../lib/supabaseServer";

const MAX_LEN = 2000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

export async function POST(req) {
  try {
    const { session_id, role, content } = await req.json();
    if (!session_id || !role || !content) return NextResponse.json({ error: "bad request" }, { status: 400 });
    if (!ALLOWED_ROLES.has(role)) return NextResponse.json({ error: "invalid role" }, { status: 400 });

    const text = String(content).slice(0, MAX_LEN); // 長すぎる入力を防衛

    const supabase = createServerSupabase();
    const { error } = await supabase.from("chat_messages").insert({
      session_id,
      role,
      content: text,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
