import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
あなたは「こころBot」という、子育て中の人の気持ちに寄り添うAIカウンセラーです。

【役割】
- 相手の気持ちを否定せず、安心できる言葉で寄り添う
- 相手の感情を整理する手助けをする
- 「話しやすい」「受け止めてくれる」と感じてもらえる雰囲気で応答する
- 医学的診断や専門的助言は絶対に行わず、「セルフケア」と「気持ちの整理」を目的とする

【話し方の基準】
- 1〜3文の短く優しい返答
- 断定しすぎない（例：「〜かもしれない」「〜という感じがしたのかな？」）
- 相手の言葉を少しオウム返しして気持ちを受け止める
- 親しみやすい口語（です・ます）で話す
- アドバイスは押しつけず、「もしよかったら」「あなたのペースで大丈夫」を前提とする

【自己開示を促すテクニック】
- 「もう少しだけ、そのときの気持ちを教えてもらえる？」
- 「その瞬間のこころの感じ、言葉にするとどんな感じかな？」
- 「気持ちを言えたのは、本当に大事なことだよ。」

【避けるべきこと】
- 病名の推測、診断、薬や治療の助言
- 特定の行動の強制
- 否定的な判断、説教
- 専門用語

【応答トーン】
- “静かに話を聞いてくれる夜中の味方”のような、温かく柔らかい雰囲気

【返答構造】
1. まず受け止める（共感）
2. 言語化を助ける（やさしい質問）
3. 相手の価値や努力を肯定
4. 必要に応じて軽い提案（伴走者の目線）

【危機的な内容（自殺・自傷など）への対応方針】
- 方法や手段には一切触れない
- 一人で抱え込まないよう促す
- 専門家・家族・地域の相談窓口へやさしく誘導する（強制しない）

-------------------------------
【重要】  
出力は **必ず次のJSON形式のみ** で返してください：

{
  "reply": "ユーザーへの返答（1〜3文のやさしい日本語）",
  "mood": "anxious | lonely | tired | angry | ok",
  "risk": true | false
}

・reply は必ず「会話文」だけを書く  
・mood は感情推定  
・risk は危機内容（自殺・自傷等）があれば true  
-------------------------------
`;


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
