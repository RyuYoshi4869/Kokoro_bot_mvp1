// app/thank-you/page.jsx
import Link from "next/link";

export default function ThankYou() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>ご利用ありがとうございました</h1>
      <p style={{ lineHeight: 1.8, color: "#374151", marginBottom: 16 }}>
        こころBotをご利用いただきありがとうございました。少しでも気持ちが軽くなっていたら嬉しいです。
        もし本当に辛いときや危険を感じるときは、ひとりで抱えず、下記の相談窓口に連絡してください。
      </p>

      <div style={{ padding: 16, border: "1px solid #f9a8d4", borderRadius: 12, background: "#fff0f6", marginBottom: 16 }}>
        <p style={{ margin: 0 }}>
          <strong>日本国内：</strong>「いのちの電話」<strong>0570-783-556</strong>（24時間）
        </p>
        <p style={{ margin: "8px 0 0 0" }}>
          <strong>米国：</strong>「988 Suicide & Crisis Lifeline」<strong>電話: 988</strong>
        </p>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Link
          href="/"
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #f9a8d4",
            textDecoration: "none",
            color: "#b91c1c",
            background: "#fff",
          }}
        >
          トップに戻る
        </Link>
        <Link
          href="/chat"
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            background: "#f472b6",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          もう一度はなす
        </Link>
      </div>
    </main>
  );
}

