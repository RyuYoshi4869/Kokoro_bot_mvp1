import Link from "next/link";

export default function HowTo() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>こころBotの使い方</h1>
      <ol style={{ lineHeight: 1.9 }}>
        <li>1. 「はじめる」または「今すぐ話してみる」からチャット画面へ進みます。</li>
        <li>2. いまの気持ちを短く一言でもOK。思ったままに入力してください。</li>
        <li>3. Botは1〜3文で、やさしく共感しながら受け止めます。</li>
        <li>4. 深呼吸やセルフケアの提案があったら、無理のない範囲で試してみてください。</li>
        <li>5. 何度でも、好きなタイミングで—夜中でも大丈夫です。</li>
      </ol>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>安心への取り組み</h2>
      <ul style={{ lineHeight: 1.8 }}>
        <li>・医療行為や診断は行いません（セルフケアのための雑談AIです）。</li>
        <li>・匿名で利用できます（個人情報の入力は不要です）。</li>
        <li>・危険サインが検知された場合は、適切な相談窓口の情報提示を検討しています（将来機能）。</li>
      </ul>

      <div style={{ marginTop: 24 }}>
        <Link href="/chat" style={{ textDecoration: "none", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8 }}>
          チャット画面へ戻る →
        </Link>
      </div>
    </main>
  );
}
