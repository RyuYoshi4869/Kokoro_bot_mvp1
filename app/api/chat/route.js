import { NextResponse } from "next/server";

const SYSTEM_PROMPT =
  'あなたは「こころBot」という子育て中のママの心に寄り添う共感型AIです。診断や治療は行わず、共感・受容・安心感の提供に徹してください。出力は必ず次のJSON形式のみで返してください: {"reply":"ユーザーへの返答(1〜3文の日本語)","mood":"anxious|lonely|tired|angry|ok","risk":true|false}';

export async function POST(req) {
  try {
    const { userId = "guest", sessionId = "default", message } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const body = {
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" }
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const t = await resp.text();
      return NextResponse.json({ error: t }, { status: resp.status });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { reply: "すみません、ただいまうまく応答できませんでした。", mood: "ok", risk: false };
    }

    // （任意）リスク通知（Slack Webhookを使う場合）
    if (parsed.risk === true && process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `:rotating_light: こころBot リスク検知\nuser:${userId} session:${sessionId}\nmessage:${message}\nreply:${parsed.reply}\nmood:${parsed.mood}`
          })
        });
      } catch {}
    }

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
