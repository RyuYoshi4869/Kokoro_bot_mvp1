// app/layout.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // ホーム("/")の場合、トップに戻るバーを隠す
  const showTopBar = pathname !== "/";

  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#fff5f5",
        }}
      >
        {showTopBar && (
          <div
            style={{
              padding: 12,
              background: "#ffe4e6",
              textAlign: "center",
              position: "sticky",
              top: 0,
              zIndex: 50,
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#b91c1c",
                fontWeight: 600,
              }}
            >
              ← トップに戻る
            </Link>
          </div>
        )}

        {children}
      </body>
    </html>
  );
}
