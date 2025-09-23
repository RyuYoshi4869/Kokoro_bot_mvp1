export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fff5f5" }}>
        {children}
      </body>
    </html>
  );
}
