"use client";

import { useCompare } from "../context/CompareContext";
import { useRouter } from "next/navigation";

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const router = useRouter();

  if (compareList.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: "var(--text)",
        color: "#fff",
        padding: "0.75rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
        animation: "fadeUp 0.25s ease",
      }}
    >
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.6)",
            whiteSpace: "nowrap",
          }}
        >
          Compare ({compareList.length}/3):
        </span>
        {compareList.map((c) => (
          <span
            key={c.id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: "0.82rem",
              fontWeight: 600,
              fontFamily: "Syne, sans-serif",
            }}
          >
            {c.name.length > 28 ? c.name.slice(0, 28) + "…" : c.name}
            <button
              onClick={() => removeFromCompare(c.id)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.55)",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1,
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
              aria-label={`Remove ${c.name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={clearCompare}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "rgba(255,255,255,0.7)",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: "0.8rem",
            fontFamily: "Syne, sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.18s ease",
          }}
        >
          Clear
        </button>
        <button
          onClick={() => router.push("/compare")}
          disabled={compareList.length < 2}
          style={{
            background: compareList.length >= 2 ? "var(--accent)" : "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            borderRadius: 8,
            padding: "6px 18px",
            fontSize: "0.85rem",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            cursor: compareList.length >= 2 ? "pointer" : "not-allowed",
            transition: "all 0.18s ease",
          }}
        >
          Compare Now →
        </button>
      </div>
    </div>
  );
}