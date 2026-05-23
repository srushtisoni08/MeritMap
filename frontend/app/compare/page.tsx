"use client";

import { useEffect, useState } from "react";
import { useCompare } from "@/context/CompareContext";
import { compareColleges } from "@/lib/api";
import type { College } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatFees(n: number) {
  return n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : `₹${(n / 1000).toFixed(0)}K`;
}

function formatPkg(n: number | null) {
  if (!n) return "N/A";
  return `₹${(n / 100000).toFixed(1)}L`;
}

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  Government: { bg: "#d8f3e8", color: "#2d6a4f" },
  Private:    { bg: "#dce8f5", color: "#1d3557" },
  Deemed:     { bg: "#f0dcf5", color: "#7b2d8b" },
};

interface CompareRow {
  label: string;
  key: keyof College | "fees_range" | "package_range";
  format?: (c: College) => React.ReactNode;
  highlight?: "high" | "low";
}

const ROWS: CompareRow[] = [
  {
    label: "Location",
    key: "city",
    format: (c) => `${c.city}, ${c.state}`,
  },
  {
    label: "Type",
    key: "type",
    format: (c) => {
      const colors = TYPE_COLORS[c.type] ?? { bg: "#eee", color: "#333" };
      return (
        <span
          style={{
            background: colors.bg,
            color: colors.color,
            padding: "2px 10px",
            borderRadius: 99,
            fontSize: "0.75rem",
            fontWeight: 700,
            fontFamily: "Syne, sans-serif",
          }}
        >
          {c.type}
        </span>
      );
    },
  },
  {
    label: "Established",
    key: "established",
    format: (c) => (c.established ? String(c.established) : "N/A"),
  },
  {
    label: "Rating",
    key: "rating",
    format: (c) => (
      <span style={{ fontWeight: 700 }}>
        <span style={{ color: "var(--accent-2)" }}>★ </span>
        {c.rating != null ? Number(c.rating).toFixed(1) : "N/A"} / 5
      </span>
    ),
    highlight: "high",
  },
  {
    label: "Min Fees",
    key: "fees_min",
    format: (c) => formatFees(c.fees_min),
    highlight: "low",
  },
  {
    label: "Max Fees",
    key: "fees_max",
    format: (c) => formatFees(c.fees_max),
    highlight: "low",
  },
  {
    label: "Placement %",
    key: "placement_percent",
    format: (c) =>
      c.placement_percent != null ? `${c.placement_percent}%` : "N/A",
    highlight: "high",
  },
  {
    label: "Avg Package",
    key: "avg_package",
    format: (c) => formatPkg(c.avg_package),
    highlight: "high",
  },
  {
    label: "Highest Package",
    key: "highest_package",
    format: (c) => formatPkg(c.highest_package),
    highlight: "high",
  },
  {
    label: "Courses",
    key: "courses",
    format: (c) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {c.courses.slice(0, 4).map((course) => (
          <span
            key={course}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 99,
              padding: "2px 8px",
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "var(--text-2)",
            }}
          >
            {course}
          </span>
        ))}
        {c.courses.length > 4 && (
          <span
            style={{
              fontSize: "0.72rem",
              color: "var(--text-3)",
              padding: "2px 6px",
            }}
          >
            +{c.courses.length - 4} more
          </span>
        )}
      </div>
    ),
  },
];

function getBestIndex(
  colleges: College[],
  key: keyof College,
  mode: "high" | "low"
): number {
  const values = colleges.map((c) => {
    const v = c[key];
    return typeof v === "number" ? v : null;
  });
  const valid = values.filter((v) => v !== null) as number[];
  if (valid.length < 2) return -1;
  const best = mode === "high" ? Math.max(...valid) : Math.min(...valid);
  const idx = values.findIndex((v) => v === best);
  return idx;
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (compareList.length < 2) {
      setColleges([]);
      return;
    }
    setLoading(true);
    setError("");
    compareColleges(compareList.map((c) => c.id))
      .then((res) => setColleges(res.colleges))
      .catch(() => setError("Failed to load comparison data. Please try again."))
      .finally(() => setLoading(false));
  }, [compareList]);

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (compareList.length === 0) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>⚖️</div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1.6rem",
              marginBottom: "0.75rem",
            }}
          >
            Nothing to compare yet
          </h2>
          <p
            style={{
              color: "var(--text-2)",
              marginBottom: "2rem",
              lineHeight: 1.65,
            }}
          >
            Browse colleges and click{" "}
            <strong style={{ color: "var(--text)" }}>+ Compare</strong> on any
            card. Add 2–3 colleges, then come back here to see them side by
            side.
          </p>
          <Link href="/colleges" className="btn btn-primary btn-lg">
            Browse Colleges →
          </Link>
        </div>
      </div>
    );
  }

  // ── Need one more ────────────────────────────────────────────────────────────
  if (compareList.length === 1) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>➕</div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1.5rem",
              marginBottom: "0.75rem",
            }}
          >
            Add one more college
          </h2>
          <p style={{ color: "var(--text-2)", marginBottom: "1.5rem" }}>
            You&apos;ve selected{" "}
            <strong style={{ color: "var(--text)" }}>
              {compareList[0]?.name}
            </strong>
            . Pick at least one more to compare.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Link href="/colleges" className="btn btn-primary">
              Add Colleges
            </Link>
            <button
              onClick={clearCompare}
              className="btn btn-secondary"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        paddingBottom: "5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "2rem 0 1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div className="page-container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  marginBottom: "0.3rem",
                }}
              >
                Compare Colleges
              </h1>
              <p style={{ color: "var(--text-2)", fontSize: "0.875rem" }}>
                Comparing {compareList.length} colleges · Green highlights = best value
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/colleges" className="btn btn-secondary btn-sm">
                + Add More
              </Link>
              <button
                onClick={clearCompare}
                className="btn btn-ghost btn-sm"
                style={{ color: "var(--accent)" }}
              >
                ✕ Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        {error && (
          <div
            style={{
              background: "rgba(232,82,42,0.08)",
              border: "1px solid rgba(232,82,42,0.2)",
              borderRadius: 10,
              padding: "1rem 1.25rem",
              color: "var(--accent)",
              marginBottom: "1.5rem",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <CompareTableSkeleton count={compareList.length} />
        ) : colleges.length >= 2 ? (
          <CompareTable colleges={colleges} onRemove={removeFromCompare} router={router} />
        ) : null}
      </div>
    </div>
  );
}

// ── Compare Table ──────────────────────────────────────────────────────────────
function CompareTable({
  colleges,
  onRemove,
  router,
}: {
  colleges: College[];
  onRemove: (id: number) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const colCount = colleges.length;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `180px repeat(${colCount}, 1fr)`,
    borderRadius: "var(--radius)",
    overflow: "hidden",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    boxShadow: "var(--shadow-sm)",
  };

  // College header row
  const headerRow = (
    <div style={{ display: "contents" }}>
      {/* Empty label cell */}
      <div
        style={{
          background: "var(--surface-2)",
          padding: "1rem 1.25rem",
          borderRight: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      />
      {colleges.map((c, i) => (
        <div
          key={c.id}
          style={{
            background: i % 2 === 0 ? "var(--surface)" : "var(--surface-2)",
            padding: "1.25rem 1rem",
            borderRight: i < colCount - 1 ? "1px solid var(--border)" : "none",
            borderBottom: "1px solid var(--border)",
            position: "relative",
          }}
        >
          {/* Remove button */}
          <button
            onClick={() => onRemove(c.id)}
            aria-label={`Remove ${c.name}`}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              width: 22,
              height: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              color: "var(--text-3)",
              transition: "all 0.15s ease",
            }}
          >
            ×
          </button>

          {/* Avatar */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              color: "#fff",
              marginBottom: "0.6rem",
            }}
          >
            {c.name.slice(0, 2).toUpperCase()}
          </div>

          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              lineHeight: 1.3,
              marginBottom: 4,
              cursor: "pointer",
              color: "var(--text)",
            }}
            onClick={() => router.push(`/colleges/${c.id}`)}
          >
            {c.name}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
            📍 {c.city}, {c.state}
          </div>
        </div>
      ))}
    </div>
  );

  // Data rows
  const dataRows = ROWS.map((row, rowIdx) => {
    const bestIdx = row.highlight
      ? getBestIndex(colleges, row.key as keyof College, row.highlight)
      : -1;

    return (
      <div key={row.label} style={{ display: "contents" }}>
        {/* Label cell */}
        <div
          style={{
            background: "var(--surface-2)",
            padding: "0.85rem 1.25rem",
            borderRight: "1px solid var(--border)",
            borderBottom:
              rowIdx < ROWS.length - 1 ? "1px solid var(--border)" : "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "0.78rem",
              color: "var(--text-2)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {row.label}
          </span>
        </div>

        {/* Value cells */}
        {colleges.map((c, i) => {
          const isBest = bestIdx === i;
          return (
            <div
              key={c.id}
              style={{
                background: isBest
                  ? "rgba(45,106,79,0.06)"
                  : i % 2 === 0
                  ? "var(--surface)"
                  : "var(--surface-2)",
                padding: "0.85rem 1rem",
                borderRight: i < colCount - 1 ? "1px solid var(--border)" : "none",
                borderBottom:
                  rowIdx < ROWS.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: isBest ? "#2d6a4f" : "var(--text)",
                position: "relative",
              }}
            >
              {isBest && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: "#2d6a4f",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              {row.format ? row.format(c) : String((c as unknown as Record<string, unknown>)[row.key as string] ?? "N/A")}
              {isBest && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    background: "#d8f3e8",
                    color: "#2d6a4f",
                    borderRadius: 99,
                    padding: "1px 7px",
                    fontFamily: "Syne, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    flexShrink: 0,
                  }}
                >
                  Best
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  });

  // CTA row — view detail buttons
  const ctaRow = (
    <div style={{ display: "contents" }}>
      <div
        style={{
          background: "var(--surface-2)",
          padding: "1rem 1.25rem",
          borderRight: "1px solid var(--border)",
        }}
      />
      {colleges.map((c, i) => (
        <div
          key={c.id}
          style={{
            background: i % 2 === 0 ? "var(--surface)" : "var(--surface-2)",
            padding: "1rem",
            borderRight: i < colCount - 1 ? "1px solid var(--border)" : "none",
          }}
        >
          <button
            onClick={() => router.push(`/colleges/${c.id}`)}
            className="btn btn-primary btn-sm"
            style={{ width: "100%" }}
          >
            View Details →
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Scrollable wrapper for mobile */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ ...gridStyle, minWidth: 480 }}>
          {headerRow}
          {dataRows}
          {ctaRow}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: "0.8rem",
          color: "var(--text-3)",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            background: "#2d6a4f",
            borderRadius: 3,
          }}
        />
        Green highlight = best value in that row (highest rating/placement, lowest fees)
      </div>
    </>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CompareTableSkeleton({ count }: { count: number }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `180px repeat(${count}, 1fr)`,
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border)",
          padding: "1.25rem 1rem",
          gap: "1rem",
        }}
      >
        <div />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            <div
              className="skeleton"
              style={{ height: 48, width: 48, borderRadius: 10, marginBottom: 8 }}
            />
            <div
              className="skeleton"
              style={{ height: 16, marginBottom: 6, width: "80%" }}
            />
            <div className="skeleton" style={{ height: 12, width: "55%" }} />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: 8 }).map((_, ri) => (
        <div
          key={ri}
          style={{
            display: "grid",
            gridTemplateColumns: `180px repeat(${count}, 1fr)`,
            borderBottom:
              ri < 7 ? "1px solid var(--border)" : "none",
            padding: "0.85rem 1rem",
            gap: "1rem",
            background: ri % 2 === 0 ? "var(--surface)" : "var(--surface-2)",
          }}
        >
          <div className="skeleton" style={{ height: 12, width: "70%" }} />
          {Array.from({ length: count }).map((_, ci) => (
            <div
              key={ci}
              className="skeleton"
              style={{ height: 14, width: `${55 + ci * 10}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}