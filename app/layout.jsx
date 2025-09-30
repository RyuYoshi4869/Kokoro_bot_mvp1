// app/layout.jsx
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fff5f5" }}>
        <div style={{ padding: 12, background: "#ffe4e6", textAlign: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <Link href="/" style={{ textDecoration: "none", color: "#b91c1c", fontWeight: 600 }}>
            ← トップに戻る
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
