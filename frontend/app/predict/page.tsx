"use client";

import { useState } from "react";
import { fetchPredict } from "@/lib/api";
import { useCompare } from "@/context/CompareContext";
import { useToast } from "@/components/ToastProvider";
import type { College } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EXAMS = [
  { value: "JEE", label: "JEE Main / Advanced", icon: "⚙️", desc: "Engineering — IITs, NITs, IIITs" },
  { value: "BITSAT", label: "BITSAT", icon: "🔬", desc: "BITS Pilani & campuses" },
  { value: "MHT-CET", label: "MHT-CET", icon: "🏛️", desc: "Maharashtra state engineering" },
  { value: "KCET", label: "KCET", icon: "🌿", desc: "Karnataka state engineering" },
  { value: "TANCET", label: "TANCET", icon: "🌊", desc: "Tamil Nadu state engineering" },
];

const TYPE_COLORS: Record<string, string> = {
  Government: "badge-govt",
  Private: "badge-private",
  Deemed: "badge-deemed",
};

function formatFees(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : `₹${(n / 1000).toFixed(0)}K`;
  return `${fmt(min)} – ${fmt(max)}`;
}

function getRankTier(exam: string, rank: number): { label: string; color: string; bg: string } {
  if (exam === "JEE") {
    if (rank <= 500)   return { label: "Top IIT Territory", color: "#2d6a4f", bg: "#d8f3e8" };
    if (rank <= 5000)  return { label: "IIT / Top NIT Range", color: "#1d3557", bg: "#dce8f5" };
    if (rank <= 25000) return { label: "Good NIT / IIIT Range", color: "#7b2d8b", bg: "#f0dcf5" };
    return { label: "State / Private Range", color: "#b45309", bg: "#fef3c7" };
  }
  if (exam === "BITSAT") {
    if (rank <= 100) return { label: "BITS Pilani CS / ECE", color: "#2d6a4f", bg: "#d8f3e8" };
    if (rank <= 300) return { label: "BITS Core Branches", color: "#1d3557", bg: "#dce8f5" };
    return { label: "BITS Goa / Hyderabad", color: "#7b2d8b", bg: "#f0dcf5" };
  }
  if (rank <= 1000)  return { label: "Top Colleges", color: "#2d6a4f", bg: "#d8f3e8" };
  if (rank <= 10000) return { label: "Good Colleges", color: "#1d3557", bg: "#dce8f5" };
  return { label: "State Colleges", color: "#b45309", bg: "#fef3c7" };
}

export default function PredictPage() {
  const { addToCompare, isInCompare, compareList } = useCompare();
  const { toast } = useToast();
  const router = useRouter();

  const [exam, setExam] = useState("JEE");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<College[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState<{ exam: string; rank: number } | null>(null);

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    const rankNum = parseInt(rank, 10);
    if (!rank || isNaN(rankNum) || rankNum < 1) {
      setError("Please enter a valid rank");
      return;
    }
    if (rankNum > 2000000) {
      setError("Please enter a rank below 20,00,000");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const res = await fetchPredict(exam, rankNum);
      setResults(res.colleges);
      setSearched({ exam: res.exam, rank: res.rank });
    } catch {
      setError("Failed to fetch predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCompare(college: College) {
    if (isInCompare(college.id)) {
      toast("Already in compare list", "info");
      return;
    }
    if (compareList.length >= 3) {
      toast("You can compare up to 3 colleges at once", "info");
      return;
    }
    addToCompare(college);
    toast(`${college.name} added to compare`, "success");
  }

  const tier = searched ? getRankTier(searched.exam, searched.rank) : null;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "5rem" }}>
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
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(232,82,42,0.08)",
              border: "1px solid rgba(232,82,42,0.2)",
              borderRadius: 99,
              padding: "4px 12px",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              📊 Rank-based Predictor
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              marginBottom: "0.35rem",
            }}
          >
            College Predictor
          </h1>
          <p style={{ color: "var(--text-2)", fontSize: "0.875rem" }}>
            Enter your exam and rank to see colleges you can likely get into.
          </p>
        </div>
      </div>

      <div className="page-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr)",
            gap: "2rem",
            alignItems: "start",
          }}
          className="predict-grid"
        >
          {/* ── Left: Input form ─────────────────────────────────────── */}
          <div>
            <form onSubmit={handlePredict}>
              <div className="card" style={{ padding: "1.5rem" }}>
                <h2
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  Enter your details
                </h2>

                {/* Exam selector */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label className="label">Select Exam</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {EXAMS.map((e) => (
                      <button
                        key={e.value}
                        type="button"
                        onClick={() => setExam(e.value)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "0.65rem 0.9rem",
                          borderRadius: "var(--radius-sm)",
                          border: `1.5px solid ${
                            exam === e.value ? "var(--accent)" : "var(--border)"
                          }`,
                          background:
                            exam === e.value
                              ? "rgba(232,82,42,0.06)"
                              : "var(--surface)",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{e.icon}</span>
                        <div>
                          <div
                            style={{
                              fontFamily: "Syne, sans-serif",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color:
                                exam === e.value
                                  ? "var(--accent)"
                                  : "var(--text)",
                            }}
                          >
                            {e.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-3)",
                              marginTop: 1,
                            }}
                          >
                            {e.desc}
                          </div>
                        </div>
                        {exam === e.value && (
                          <span
                            style={{
                              marginLeft: "auto",
                              color: "var(--accent)",
                              fontWeight: 700,
                              fontSize: "1rem",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rank input */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label className="label" htmlFor="rank">
                    Your Rank
                  </label>
                  <input
                    id="rank"
                    className="input"
                    type="number"
                    min={1}
                    placeholder="e.g. 5000"
                    value={rank}
                    onChange={(e) => {
                      setRank(e.target.value);
                      setError("");
                    }}
                  />
                  {error && (
                    <p
                      style={{
                        color: "var(--accent)",
                        fontSize: "0.8rem",
                        marginTop: 6,
                        fontWeight: 500,
                      }}
                    >
                      {error}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                      marginTop: 6,
                    }}
                  >
                    Enter your All India Rank (AIR)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", opacity: loading ? 0.75 : 1 }}
                >
                  {loading ? "Predicting…" : "Predict Colleges →"}
                </button>
              </div>
            </form>

            {/* How it works */}
            <div
              className="card"
              style={{ padding: "1.25rem", marginTop: "1rem" }}
            >
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  marginBottom: "0.75rem",
                  color: "var(--text-2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                How it works
              </h3>
              {[
                "Enter your exam and rank",
                "Our rule-based engine maps your rank to eligible college tiers",
                "Results are sorted by rating and placement %",
                "Add colleges to compare for a side-by-side view",
              ].map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: i < 3 ? "0.6rem" : 0,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      fontFamily: "Syne, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Results ───────────────────────────────────────── */}
          <div>
            {/* Initial state */}
            {!loading && results === null && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  background: "var(--surface)",
                  borderRadius: "var(--radius)",
                  border: "1.5px dashed var(--border)",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎓</div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your results will appear here
                </h3>
                <p style={{ color: "var(--text-2)", fontSize: "0.875rem" }}>
                  Select your exam and enter your rank to get started.
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <PredictCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && results !== null && (
              <>
                {/* Summary banner */}
                {searched && tier && (
                  <div
                    style={{
                      background: tier.bg,
                      border: `1px solid ${tier.color}22`,
                      borderRadius: "var(--radius)",
                      padding: "1rem 1.25rem",
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "Syne, sans-serif",
                          fontWeight: 800,
                          fontSize: "1rem",
                          color: tier.color,
                          marginBottom: 2,
                        }}
                      >
                        {tier.label}
                      </div>
                      <div
                        style={{ fontSize: "0.8rem", color: tier.color, opacity: 0.75 }}
                      >
                        {searched.exam} Rank {searched.rank.toLocaleString("en-IN")} ·{" "}
                        {results.length} college{results.length !== 1 ? "s" : ""} found
                      </div>
                    </div>
                    {results.length > 0 && compareList.length < 3 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: tier.color,
                          opacity: 0.7,
                          fontStyle: "italic",
                        }}
                      >
                        Tip: Add to compare →
                      </span>
                    )}
                  </div>
                )}

                {/* No results */}
                {results.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem 2rem",
                      background: "var(--surface)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>😕</div>
                    <h3
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      No colleges found
                    </h3>
                    <p
                      style={{
                        color: "var(--text-2)",
                        fontSize: "0.875rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      We don&apos;t have enough data for this rank range yet.
                      Try browsing all colleges instead.
                    </p>
                    <Link href="/colleges" className="btn btn-secondary">
                      Browse All Colleges
                    </Link>
                  </div>
                )}

                {/* College list */}
                {results.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {results.map((college, i) => (
                      <PredictCard
                        key={college.id}
                        college={college}
                        rank={i + 1}
                        inCompare={isInCompare(college.id)}
                        onCompare={() => handleCompare(college)}
                        onView={() => router.push(`/colleges/${college.id}`)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responsive grid style */}
      <style>{`
        @media (max-width: 768px) {
          .predict-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Predict Card ──────────────────────────────────────────────────────────────
function PredictCard({
  college,
  rank,
  inCompare,
  onCompare,
  onView,
}: {
  college: College;
  rank: number;
  inCompare: boolean;
  onCompare: () => void;
  onView: () => void;
}) {
  return (
    <div
      className="card animate-fade-up"
      style={{
        animationDelay: `${rank * 60}ms`,
        padding: "1.1rem 1.25rem",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: rank <= 3 ? "var(--accent)" : "var(--surface-2)",
          border: `1.5px solid ${rank <= 3 ? "var(--accent)" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "0.9rem",
          color: rank <= 3 ? "#fff" : "var(--text-2)",
          flexShrink: 0,
        }}
      >
        #{rank}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span className={`badge ${TYPE_COLORS[college.type] ?? "badge-private"}`}>
            {college.type}
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              color: "var(--accent-2)",
              fontWeight: 700,
            }}
          >
            ★ {college.rating != null ? Number(college.rating).toFixed(1) : "N/A"}
          </span>
        </div>

        <h3
          onClick={onView}
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "var(--text)",
            marginBottom: 3,
            cursor: "pointer",
            lineHeight: 1.3,
          }}
        >
          {college.name}
        </h3>

        <p style={{ fontSize: "0.8rem", color: "var(--text-2)", marginBottom: 8 }}>
          📍 {college.city}, {college.state}
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <MiniStat
            label="Fees"
            value={`₹${(college.fees_min / 100000).toFixed(1)}L+`}
          />
          {college.placement_percent != null && (
            <MiniStat
              label="Placement"
              value={`${college.placement_percent}%`}
              accent
            />
          )}
          {college.avg_package != null && (
            <MiniStat
              label="Avg Pkg"
              value={`₹${(college.avg_package / 100000).toFixed(1)}L`}
            />
          )}
          {college.courses.length > 0 && (
            <MiniStat label="Courses" value={String(college.courses.length)} />
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <button
          onClick={onView}
          className="btn btn-secondary btn-sm"
          style={{ whiteSpace: "nowrap" }}
        >
          Details →
        </button>
        <button
          onClick={onCompare}
          className={`btn btn-sm ${inCompare ? "btn-primary" : "btn-secondary"}`}
          style={{ whiteSpace: "nowrap" }}
        >
          {inCompare ? "✓ Added" : "+ Compare"}
        </button>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "0.65rem",
          color: "var(--text-3)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "0.82rem",
          fontWeight: 700,
          color: accent ? "var(--govt)" : "var(--text)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PredictCardSkeleton() {
  return (
    <div
      className="card"
      style={{ padding: "1.1rem 1.25rem", display: "flex", gap: "1rem" }}
    >
      <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 12, width: "30%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, width: "70%", marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 16 }}>
          {[60, 70, 55, 50].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 28, width: w }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        <div className="skeleton" style={{ height: 30, width: 80, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 30, width: 80, borderRadius: 8 }} />
      </div>
    </div>
  );
}