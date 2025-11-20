import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          backgroundColor: "#ffffff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        {/* 見出し */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 12,
            textAlign: "center",
            color: "#111827",
          }}
        >
          ようこそ、こころBotへ。
        </h1>

        {/* サブコピー */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "#4b5563",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          子育て中の夜も昼も。
          <br />
          匿名で、やさしく、気持ちを言葉にできる場所です。
        </p>

        {/* シチュエーションの３行 */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 12px",
            fontSize: 13,
            color: "#4b5563",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          <li>不安な夜に</li>
          <li>イライラが止まらないとき</li>
          <li>少し気持ちを吐き出したいときに</li>
        </ul>

        {/* 説明一文 */}
        <p
          style={{
            fontSize: 13,
            color: "#374151",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          AIが1〜3文で、あなたの“こころ”にそっと寄り添います。
        </p>

        {/* CTA ボタン：1つだけ */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Link
            href="/chat"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 20px",
              borderRadius: 999,
              background:
                "linear-gradient(135deg, #fb7185, #f97316)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(248, 113, 113, 0.35)",
              width: "100%",
              maxWidth: 260,
            }}
          >
            今すぐ話してみる
          </Link>
        </div>

        {/* 区切り線 */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e7eb",
            margin: "8px 0 16px",
          }}
        />

        {/* 特徴セクション：短く３点だけ */}
        <section>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 8,
              color: "#111827",
            }}
          >
            こころBotの特徴
          </h2>
          <ul
            style={{
              fontSize: 13,
              color: "#374151",
              paddingLeft: 0,
              margin: 0,
              lineHeight: 1.7,
              listStyle: "none",
            }}
          >
            <li>・共感・受容・非評価のスタンスで対話します</li>
            <li>・匿名・個人情報なし、テキストのみのやりとり</li>
            <li>・会話内容はあなたのセルフケアのためだけに保存されます</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

