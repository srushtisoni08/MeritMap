"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCollege, fetchSavedIds, saveCollege, unsaveCollege } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCompare } from "@/context/CompareContext";
import { useToast } from "@/components/ToastProvider";
import type { CollegeDetail } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) =>
        i < Math.floor(rating) ? "★" : i === Math.floor(rating) && rating % 1 >= 0.5 ? "½" : "☆"
      ).join("")}
    </span>
  );
}

function formatPkg(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

function formatFees(n: number) {
  return n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;
}

const TYPE_COLORS: Record<string, string> = {
  Government: "badge-govt",
  Private: "badge-private",
  Deemed: "badge-deemed",
};

export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { toast } = useToast();

  const [data, setData] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchCollege(Number(id));
        setData(res);
        if (isLoggedIn) {
          const saved = await fetchSavedIds();
          setIsSaved(saved.ids.includes(Number(id)));
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isLoggedIn]);

  async function handleSave() {
    if (!isLoggedIn) { toast("Please login to save colleges", "info"); return; }
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveCollege(Number(id));
        setIsSaved(false);
        toast("Removed from saved", "info");
      } else {
        await saveCollege(Number(id));
        setIsSaved(true);
        toast("College saved!", "success");
      }
    } catch { toast("Something went wrong", "error"); }
    finally { setSaving(false); }
  }

  function handleCompare() {
    if (!data) return;
    if (isInCompare(data.college.id)) {
      removeFromCompare(data.college.id);
      toast("Removed from compare", "info");
    } else {
      addToCompare(data.college);
      toast(`${data.college.name} added to compare`, "success");
    }
  }

  if (loading) return <DetailSkeleton />;

  if (notFound || !data) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 1rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>College not found</h2>
        <button className="btn btn-primary" onClick={() => router.push("/colleges")}>← Back to colleges</button>
      </div>
    );
  }

  const { college, reviews } = data;
  const inCompare = isInCompare(college.id);

  const TABS = ["overview", "courses", "placements", "reviews"] as const;

  return (
    <div style={{ background: "var(--bg)", paddingBottom: "5rem" }}>
      {/* Hero banner */}
      <div
        style={{
          background: "var(--text)",
          color: "#fff",
          padding: "2.5rem 0",
          marginBottom: "2rem",
        }}
      >
        <div className="page-container">
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontFamily: "Syne, sans-serif", fontSize: "0.82rem", fontWeight: 600, marginBottom: "1rem", padding: 0, display: "flex", alignItems: "center", gap: 6 }}
          >
            ← Back
          </button>

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Logo / avatar */}
            <div
              style={{
                width: 80, height: 80, borderRadius: 16, overflow: "hidden", flexShrink: 0,
                background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#fff",
              }}
            >
              {college.name.slice(0, 2).toUpperCase()}
            </div>

            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <span className={`badge ${TYPE_COLORS[college.type] ?? "badge-private"}`}>
                  {college.type}
                </span>
                {college.established && (
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                    Est. {college.established}
                  </span>
                )}
              </div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: 8, lineHeight: 1.2 }}>
                {college.name}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                📍 {college.city}, {college.state}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-secondary"
                style={{ background: isSaved ? "var(--accent)" : "rgba(255,255,255,0.1)", borderColor: "transparent", color: "#fff" }}
              >
                {isSaved ? "♥ Saved" : "♡ Save"}
              </button>
              <button
                onClick={handleCompare}
                className="btn btn-secondary"
                style={{ background: inCompare ? "rgba(232,82,42,0.25)" : "rgba(255,255,255,0.1)", borderColor: "transparent", color: "#fff" }}
              >
                {inCompare ? "✓ In Compare" : "+ Compare"}
              </button>
              {college.website && (
                <a href={college.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Visit Website ↗
                </a>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 1,
              marginTop: "2rem",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {[
              { label: "Fees (min)", value: formatFees(college.fees_min) },
              { label: "Fees (max)", value: formatFees(college.fees_max) },
              { label: "Rating", value: `${college.rating.toFixed(1)} / 5` },
              { label: "Placement", value: college.placement_percent ? `${college.placement_percent}%` : "N/A" },
              { label: "Avg Package", value: college.avg_package ? formatPkg(college.avg_package) : "N/A" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "1rem 1.25rem", background: "rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="page-container">
        <div style={{ display: "flex", gap: 4, borderBottom: "2px solid var(--border)", marginBottom: "2rem", overflowX: "auto" }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                background: "none",
                border: "none",
                padding: "0.75rem 1.25rem",
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                color: activeTab === t ? "var(--accent)" : "var(--text-2)",
                borderBottom: activeTab === t ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: -2,
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                transition: "color 0.18s ease",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {activeTab === "overview" && (
            <div style={{ maxWidth: 760 }}>
              {college.description && (
                <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: "0.75rem" }}>About</h3>
                  <p style={{ color: "var(--text-2)", lineHeight: 1.75, fontSize: "0.925rem" }}>{college.description}</p>
                </div>
              )}
              <div className="card" style={{ padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: "1rem" }}>Quick Info</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {[
                    { label: "Location", value: `${college.city}, ${college.state}` },
                    { label: "Type", value: college.type },
                    { label: "Established", value: college.established ? String(college.established) : "N/A" },
                    { label: "Rating", value: <><Stars rating={college.rating} /> {college.rating.toFixed(1)}</> },
                    { label: "Fees Range", value: `${formatFees(college.fees_min)} – ${formatFees(college.fees_max)}` },
                    { label: "Courses", value: `${college.courses.length} programs` },
                  ].map((r) => (
                    <div key={r.label} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{r.label}</div>
                      <div style={{ fontWeight: 600, fontSize: "0.925rem", display: "flex", alignItems: "center", gap: 4 }}>{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div style={{ maxWidth: 760 }}>
              <div className="card" style={{ padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                  Courses Offered ({college.courses.length})
                </h3>
                {college.courses.length === 0 ? (
                  <p style={{ color: "var(--text-3)" }}>No course data available.</p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {college.courses.map((c) => (
                      <span
                        key={c}
                        style={{
                          padding: "8px 16px",
                          background: "var(--surface-2)",
                          borderRadius: 99,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          fontFamily: "Syne, sans-serif",
                          color: "var(--text)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "placements" && (
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                {[
                  { label: "Placement Rate", value: college.placement_percent ? `${college.placement_percent}%` : "N/A", color: "var(--govt)" },
                  { label: "Average Package", value: college.avg_package ? formatPkg(college.avg_package) : "N/A", color: "var(--accent)" },
                  { label: "Highest Package", value: college.highest_package ? formatPkg(college.highest_package) : "N/A", color: "var(--deemed)" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="card"
                    style={{ padding: "1.5rem", textAlign: "center" }}
                  >
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "2rem", color: s.color, marginBottom: 6 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {(!college.placement_percent && !college.avg_package) && (
                <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)" }}>
                  Placement data not available for this college.
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={{ maxWidth: 760 }}>
              {reviews.length === 0 ? (
                <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>💬</div>
                  <h4 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>No reviews yet</h4>
                  <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>Be the first to share your experience.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {reviews.map((r) => (
                    <div key={r.id} className="card" style={{ padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
                            {r.author_name ?? "Anonymous"}
                          </span>
                          <div>
                            <Stars rating={r.rating} />
                            <span style={{ fontSize: "0.78rem", color: "var(--text-3)", marginLeft: 6 }}>
                              {r.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                          {new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {r.comment && (
                        <p style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.65 }}>{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div style={{ background: "var(--bg)" }}>
      <div style={{ background: "var(--text)", padding: "2.5rem 0", marginBottom: "2rem" }}>
        <div className="page-container">
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
            <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 16, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: 80, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 28, width: "60%", marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 14, width: 200 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="page-container">
        <div style={{ display: "flex", gap: 16, marginBottom: "2rem" }}>
          {[120, 100, 110, 90].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 36, width: w, borderRadius: 8 }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: 760 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 60, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    </div>
  );
}