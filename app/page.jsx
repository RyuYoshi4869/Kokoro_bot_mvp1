"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";

// --- 匿名ユーザーIDをlocalStorageに保持 ---
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

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // --- PostHog init（初回） ---
  useEffect(() => {
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        capture_pageview: false,
        capture_pageleave: false
      });
    }
  }, []);

  // --- 匿名ユーザー & セッション（クライアントで生成） ---
  const anonUserId = useMemo(() => getAnonUserId(), []);
  const sessionIdRef = useRef(crypto.randomUUID());
  const turnsRef = useRef(0); // assistant返信回数＝ラリー数

  // --- セッション開始イベント ---
  useEffect(() => {
    posthog.capture("session_started", {
      session_id: sessionIdRef.current,
      anon_user_id: anonUserId
    });
    // ページ離脱時の保険（session_end_clicked代替）
    const onLeave = () => {
      posthog.capture("session_end_clicked", { session_id: sessionIdRef.current });
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput("");

    // UI反映＋イベント（user）
    setMessages((m) => [...m, { role: "user", content: text }]);
    posthog.capture("message_sent", {
      session_id: sessionIdRef.current,
      role: "user"
    });

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // userId / sessionId は現状使わないので送らない
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // UI反映＋イベント（assistant）
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      posthog.capture("message_sent", {
        session_id: sessionIdRef.current,
        role: "assistant"
      });

      // ラリー（assistant返信）を加算して5到達を検知
      turnsRef.current += 1;
      if (turnsRef.current === 5) {
        posthog.capture("turns_reached_5", { session_id: sessionIdRef.current });
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "エラーが発生しました。時間をおいて再度お試しください。"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // --- 終了ボタン押下：アンケ表示→送信 ---
  const [showSurvey, setShowSurvey] = useState(false);
  const [anxiety, setAnxiety] = useState(0); // 1-5
  const [retention, setRetention] = useState(null); // true/false/null

  function openSurvey() {
    setShowSurvey(true);
  }

  function submitSurvey() {
    posthog.capture("session_end_clicked", {
      session_id: sessionIdRef.current
    });
    if (anxiety > 0 || retention !== null) {
      posthog.capture("survey_submitted", {
        session_id: sessionIdRef.current,
        anxiety_score: anxiety || null,
        retention_intent: retention
      });
    }
    // 新しいセッションを開始（リセット）
    sessionIdRef.current = crypto.randomUUID();
    turnsRef.current = 0;
    setShowSurvey(false);
    setMessages((m) => [...m, { role: "assistant", content: "ご利用ありがとうございました。必要なときは、いつでも声をかけてくださいね。" }]);
    // 次セッション開始イベント
    posthog.capture("session_started", {
      session_id: sessionIdRef.current,
      anon_user_id: anonUserId
    });
    setAnxiety(0);
    setRetention(null);
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
            borderRadius: 10,
            padding: 12,
            height: "60vh",
            overflowY: "auto",
            background: "#fff0f6"
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "#9ca3af" }}>メッセージを入力して送信してください。</div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                margin: "8px 0"
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "8px 12px",
                  borderRadius: 16,
                  background: m.role === "user" ? "#f472b6" : "#ffe4e6",
                  color: m.role === "user" ? "#fff" : "#111",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* 入力欄 */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            style={{
              flex: 1,
              border: "1px solid #f9a8d4",
              borderRadius: 6,
              padding: "8px 10px",
              background: "#fff"
            }}
            placeholder="ここに入力（Enterで送信）"
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
              padding: "8px 16px",
              borderRadius: 6,
              background: "#f472b6",
              color: "#fff",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "送信中…" : "送信"}
          </button>
          <button
            onClick={openSurvey}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              background: "transparent",
              border: "1px solid #f9a8d4",
              color: "#b91c1c"
            }}
            title="セッションを終了してアンケートに回答"
          >
            終了
          </button>
        </div>

        {/* ミニアンケ モーダル（超シンプル実装） */}
        {showSurvey && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #f3f4f6",
                padding: 16
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>ご利用ありがとうございました</h2>
              <p style={{ color: "#374151", marginBottom: 12 }}>
                2つだけ教えてください（任意）。今後の改善に使います。
              </p>

              <label style={{ display: "block", marginBottom: 8 }}>
                安心して話せたと感じましたか？（1〜5）
              </label>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setAnxiety(n)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: anxiety === n ? "2px solid #f472b6" : "1px solid #e5e7eb",
                      background: anxiety === n ? "#ffe4e6" : "#fff"
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <label style={{ display: "block", marginBottom: 8 }}>
                また使いたいと思いますか？（はい / いいえ）
              </label>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button
                  onClick={() => setRetention(true)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: retention === true ? "2px solid #f472b6" : "1px solid #e5e7eb",
                    background: retention === true ? "#ffe4e6" : "#fff"
                  }}
                >
                  はい
                </button>
                <button
                  onClick={() => setRetention(false)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: retention === false ? "2px solid #f472b6" : "1px solid #e5e7eb",
                    background: retention === false ? "#ffe4e6" : "#fff"
                  }}
                >
                  いいえ
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowSurvey(false)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#fff"
                  }}
                >
                  キャンセル
                </button>
                <button
                  onClick={submitSurvey}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "#f472b6",
                    color: "#fff"
                  }}
                >
                  送信して終了
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
