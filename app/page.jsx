import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Welcome to KokoroBot</h1>
      <p><Link href="/chat">こころBotチャットへ →</Link></p>
    </main>
  );
}
