// app/survey/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";

const SESSION_KEY = "kororo_session_id";
const getSessionIdLS = () => (typeof window === "undefined" ? null : localStorage.getItem(SESSION_KEY));
function ensurePosthog() {
  if (!posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: false,
    });
  }
}

export default function SurveyPage() {
  const [anxiety, setAnxiety] = useState(0); // 1..5
  const [retention, setRetention] = useState(null); // true/false
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    ensurePosthog();
  }, []);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);

    const session_id = getSessionIdLS();

    // PostHog: 終了 & アンケ
    posthog.capture("session_end_clicked", { session_id });
    posthog.capture("survey_submitted", {
      session_id,
      anxiety_score: anxiety || null,
      retention_intent: retention,
    });

    // Supabase: セッション終了（存在する場合のみ）
    try {
      if (session_id) {
        await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "end", session_id }),
        });
      }
    } catch (_) {
      // ログ保存失敗はUXを止めない（PostHog側で検知できるのでOK）
    }

    router.push("/thank-you");
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>アンケート</h1>
      <p style={{ color: "#374151", marginBottom: 12 }}>
        改善のために、2つだけ教えてください（任意）
      </p>

      <label style={{ display: "block", marginBottom: 8 }}>
        安心して話せたと感じましたか？（1〜5）
      </label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setAnxiety(n)}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: anxiety === n ? "2px solid #f472b6" : "1px solid #e5e7eb",
              background: anxiety === n ? "#ffe4e6" : "#fff",
              minWidth: 44,
            }}
          >
            {n}
          </button>
        ))}
      </div>

      <label style={{ display: "block", marginBottom: 8 }}>
        また使いたいと思いますか？
      </label>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setRetention(true)}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: retention === true ? "2px solid #f472b6" : "1px solid #e5e7eb",
            background: retention === true ? "#ffe4e6" : "#fff",
          }}
        >
          はい
        </button>
        <button
          onClick={() => setRetention(false)}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: retention === false ? "2px solid #f472b6" : "1px solid #e5e7eb",
            background: retention === false ? "#ffe4e6" : "#fff",
          }}
        >
          いいえ
        </button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={submit}
          disabled={submitting}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            background: "#f472b6",
            color: "#fff",
            fontWeight: 700,
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "送信中…" : "送信する"}
        </button>
        <Link
          href="/chat"
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #f9a8d4",
            textDecoration: "none",
            color: "#b91c1c",
            background: "#fff",
          }}
        >
          チャットに戻る
        </Link>
      </div>
    </main>
  );
}
