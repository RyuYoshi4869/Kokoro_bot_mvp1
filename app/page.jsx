import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 820 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, color: "#b91c1c" }}>
          ようこそ、こころBotへ。
        </h1>
        <p style={{ fontSize: 16, color: "#4b5563", marginBottom: 24 }}>
          子育ての夜も昼も、匿名で安心して気持ちを言葉にできる場所です。
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <Link href="/chat" style={{
            background: "#f472b6", color: "#fff", padding: "12px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 600
          }}>
            はじめる
          </Link>
          <Link href="/chat" style={{
            background: "#f9a8d4", color: "#111", padding: "12px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 600, border: "1px solid #f472b6"
          }}>
            今すぐ話してみる
          </Link>
          <Link href="/how-to" style={{
            background: "transparent", color: "#b91c1c", padding: "12px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 600, border: "1px solid #fca5a5"
          }}>
            使い方を見る
          </Link>
        </div>

        {/* 概要（こころBotとは？） */}
        <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>こころBotとは</h2>
          <p style={{ lineHeight: 1.8, color: "#374151" }}>
            こころBotは、子育て中のママの「安心」と「自己開示」を支えるAIチャットです。医療行為や診断は行わず、<strong>共感・受容・非評価</strong>の姿勢で短い対話を重ねます。
            夜中の授乳で孤独を感じるとき、イライラして気持ちを整えたいとき、ただ少し気持ちを吐き出したいとき——匿名で気兼ねなく話しかけてください。
            会話はテキストのみ。<strong>個人情報は不要</strong>で、記録はセルフケアの振り返りとして活用できます。
          </p>
          <ul style={{ marginTop: 12, color: "#374151" }}>
            <li>・1〜3文の短い返答で、いまの気持ちに寄り添います</li>
            <li>・「大丈夫」に近づくための呼吸やセルフケアを優しく提案</li>
            <li>・必要に応じて注意サインを検知し、ヘルプ先の情報提示（将来機能）</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

