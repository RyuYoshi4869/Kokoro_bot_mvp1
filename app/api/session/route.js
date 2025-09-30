import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { action, session_id, anon_user_id } = await req.json();
    if (!action || !session_id) return NextResponse.json({ error: "bad request" }, { status: 400 });

    const supabase = createServerSupabase();

    if (action === "start") {
      const { error } = await supabase.from("chat_sessions").insert({
        id: session_id,
        anon_user_id,
        started_at: new Date().toISOString(),
      });
      if (error) throw error;
    } else if (action === "end") {
      const { error } = await supabase
        .from("chat_sessions")
        .update({ ended_at: new Date().toISOString() })
        .eq("id", session_id);
      if (error) throw error;
    } else {
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
