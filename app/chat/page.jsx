// app/chat/page.jsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";

// ---- 共通ユーティリティ ----
function ensurePosthog() {
  if (!posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: false,
    });
  }
}
function getAnonUserId() {
  const KEY = "kororo_anon_user_id";
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
const SESSION_KEY = "kororo_session_id";
function setSessionIdLS(id) {
  if (typeof window !== "undefined") localStorage.setItem(SESSION_KEY, id);
}
function getSessionIdLS() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // init
  useEffect(() => {
    ensurePosthog();
  }, []);

  const anonUserId = useMemo(() => getAnonUserId(), []);
  const sessionIdRef = useRef(getSessionIdLS() || crypto.randomUUID());
  const turnsRef = useRef(0); // assistant 返信回数（=ラリー数）

  // セッション開始を必ず1回送る（初回入力時でもOKだがここで送る）
  useEffect(() => {
    ensurePosthog();
    // セッションIDを保存（surveyで使う）
    setSessionIdLS(sessionIdRef.current);

    // 二重送信防止用フラグ
    const FLAG = "kororo_session_started_sent";
    if (!sessionStorage.getItem(FLAG)) {
      posthog.capture("session_started", {
        session_id: sessionIdRef.current,
        anon_user_id: anonUserId,
      });
      sessionStorage.setItem(FLAG, "1");
    }

    // 離脱保険
    const onLeave = () => {
      posthog.capture("session_end_clicked", { session_id: sessionIdRef.current });
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [anonUserId]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput("");

    // UI反映＋イベント（user）
    setMessages((m) => [...m, { role: "user", content: text }]);
    posthog.capture("message_sent", {
      session_id: sessionIdRef.current,
      role: "user",
    });

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // UI反映＋イベント（assistant）
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      posthog.capture("message_sent", {
        session_id: sessionIdRef.current,
        role: "assistant",
      });

      // ラリー到達判定
      turnsRef.current += 1;
      if (turnsRef.current === 5) {
        posthog.capture("turns_reached_5", { session_id: sessionIdRef.current });
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "エラーが発生しました。時間をおいて再度お試しください。" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 720 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: "#b91c1c" }}>
          ようこそ、こころBotへ。
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 12 }}>
          子育ての夜も昼も、匿名で安心して気持ちを言葉にできる場所です。
        </p>

        {/* チャットログ */}
        <div
          style={{
            border: "1px solid #f9a8d4",
            borderRadius: 16,
            padding: 12,
            height: "60vh",
            overflowY: "auto",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "#9ca3af", textAlign: "center", marginTop: "30%" }}>
              こころbotとチャットしてみよう！！
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                margin: "8px 0",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
                  background:
                    m.role === "user"
                      ? "linear-gradient(135deg,#f472b6,#f9a8d4)"
                      : "#ffe4e6",
                  color: m.role === "user" ? "#fff" : "#111",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* 入力欄 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
            background: "#fff0f6",
            borderRadius: 12,
            padding: 8,
          }}
        >
          <input
            style={{
              flex: 1,
              border: "1px solid #f9a8d4",
              borderRadius: 8,
              padding: "10px 12px",
              background: "#fff",
            }}
            placeholder="ここに気持ちを入力してみてください 🌸（Enterで送信）"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              background: "#f472b6",
              color: "#fff",
              opacity: loading ? 0.6 : 1,
              fontWeight: 600,
            }}
          >
            {loading ? "送信中…" : "送信"}
          </button>
        </div>

        {/* アンケート遷移ボタン（入力欄の下・下部寄せ） */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <Link
            href="/survey"
            onClick={() => {
              // 念のため現セッションIDを保存しておく
              setSessionIdLS(sessionIdRef.current);
            }}
            style={{
              display: "inline-block",
              padding: "12px 16px",
              borderRadius: 8,
              background: "#f472b6",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            チャットを終了してアンケートに答える
          </Link>
        </div>
      </div>
    </div>
  );
}
