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
        backgroundColor: "#fff1f2", // やわらかいピンク背景
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          backgroundColor: "#ffffff",
          borderRadius: 16,
          padding: 30,
          boxShadow: "0 12px 32px rgba(244, 114, 182, 0.18)", // ピンク系の影
        }}
      >
        {/* 見出し */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 12,
            textAlign: "center",
            color: "#be185d", // 少し濃いめのピンク
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

        {/* シチュエーション３行 */}
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

        {/* 説明 */}
        <p
          style={{
            fontSize: 13,
            color: "#374151",
            textAlign: "center",
            marginBottom: 22,
          }}
        >
          AIが1〜3文で、あなたの“こころ”にそっと寄り添います。
        </p>

        {/* CTA ボタン */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {/* メイン CTA */}
          <Link
            href="/chat"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              padding: "12px 20px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #fb7185, #f472b6)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              width: "100%",
              maxWidth: 260,
              boxShadow: "0 8px 24px rgba(244, 114, 182, 0.35)",
            }}
          >
            今すぐ話してみる
          </Link>

          {/* 復活した「使い方を見る」 */}
          <Link
            href="/how-to"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              padding: "10px 18px",
              borderRadius: 999,
              backgroundColor: "#ffe4e6",
              border: "1px solid #f9a8d4",
              color: "#be185d",
              fontWeight: 600,
              fontSize: 13,
              textDecoration: "none",
              width: "100%",
              maxWidth: 260,
            }}
          >
            使い方を見る
          </Link>
        </div>

        {/* 区切り */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #fbcfe8",
            margin: "8px 0 16px",
          }}
        />

        {/* 特徴 */}
        <section>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 8,
              color: "#be185d",
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

