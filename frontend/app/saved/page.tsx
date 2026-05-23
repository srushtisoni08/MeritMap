"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchSaved, unsaveCollege } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCompare } from "@/context/CompareContext";
import { useToast } from "@/components/ToastProvider";
import type { College } from "@/lib/types";

function formatFees(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : `₹${(n / 1000).toFixed(0)}K`;
  return `${fmt(min)} – ${fmt(max)}`;
}

const TYPE_COLORS: Record<string, string> = {
  Government: "badge-govt",
  Private: "badge-private",
  Deemed: "badge-deemed",
};

export default function SavedPage() {
  const { isLoggedIn, user } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const { toast } = useToast();
  const router = useRouter();

  const [saved, setSaved] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    fetchSaved()
      .then((res) => setSaved(res.saved))
      .catch(() => toast("Failed to load saved colleges", "error"))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  async function handleUnsave(college: College) {
    setRemoving(college.id);
    try {
      await unsaveCollege(college.id);
      setSaved((prev) => prev.filter((c) => c.id !== college.id));
      toast(`${college.name} removed from saved`, "info");
    } catch {
      toast("Failed to remove college", "error");
    } finally {
      setRemoving(null);
    }
  }

  function handleCompareToggle(college: College) {
    if (isInCompare(college.id)) {
      removeFromCompare(college.id);
      toast("Removed from compare", "info");
    } else if (compareList.length >= 3) {
      toast("You can compare up to 3 colleges at once", "info");
    } else {
      addToCompare(college);
      toast(`${college.name} added to compare`, "success");
    }
  }

  // ── Not logged in ────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
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
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1.5rem",
              marginBottom: "0.75rem",
            }}
          >
            Sign in to see saved colleges
          </h2>
          <p
            style={{
              color: "var(--text-2)",
              marginBottom: "2rem",
              lineHeight: 1.65,
            }}
          >
            Create a free account to bookmark colleges and revisit them
            anytime.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Link href="/auth/login" className="btn btn-secondary">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn btn-primary">
              Create Account →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "5rem" }}>
        <PageHeader name={user?.name ?? ""} count={null} />
        <div className="page-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SavedCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────────
  if (saved.length === 0) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "5rem" }}>
        <PageHeader name={user?.name ?? ""} count={0} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 2rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>♡</div>
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "1.4rem",
                marginBottom: "0.75rem",
              }}
            >
              No saved colleges yet
            </h3>
            <p
              style={{
                color: "var(--text-2)",
                marginBottom: "2rem",
                lineHeight: 1.65,
              }}
            >
              Browse colleges and hit the{" "}
              <strong style={{ color: "var(--text)" }}>♡</strong> button on any
              card to save it here.
            </p>
            <Link href="/colleges" className="btn btn-primary btn-lg">
              Browse Colleges →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Saved list ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "5rem" }}>
      <PageHeader name={user?.name ?? ""} count={saved.length} />

      <div className="page-container">
        {/* Compare nudge */}
        {saved.length >= 2 && compareList.length === 0 && (
          <div
            style={{
              background: "rgba(232,82,42,0.06)",
              border: "1px solid rgba(232,82,42,0.18)",
              borderRadius: "var(--radius)",
              padding: "0.9rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", margin: 0 }}>
              💡 <strong style={{ color: "var(--text)" }}>Tip:</strong> Click{" "}
              <strong style={{ color: "var(--text)" }}>+ Compare</strong> on any
              card below to compare colleges side by side.
            </p>
            <Link
              href="/compare"
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0 }}
            >
              Go to Compare →
            </Link>
          </div>
        )}

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {saved.map((college, i) => (
            <SavedCard
              key={college.id}
              college={college}
              removing={removing === college.id}
              inCompare={isInCompare(college.id)}
              animationDelay={i * 50}
              onUnsave={() => handleUnsave(college)}
              onCompare={() => handleCompareToggle(college)}
              onView={() => router.push(`/colleges/${college.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────────────────
function PageHeader({ name, count }: { name: string; count: number | null }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "2rem 0 1.5rem",
        marginBottom: "2rem",
      }}
    >
      <div className="page-container">
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            marginBottom: "0.3rem",
          }}
        >
          Saved Colleges
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: "0.875rem" }}>
          {name ? `Hi ${name.split(" ")[0]} · ` : ""}
          {count === null
            ? "Loading…"
            : count === 0
            ? "Nothing saved yet"
            : `${count} college${count === 1 ? "" : "s"} saved`}
        </p>
      </div>
    </div>
  );
}

// ── Saved Card ─────────────────────────────────────────────────────────────────
function SavedCard({
  college,
  removing,
  inCompare,
  animationDelay,
  onUnsave,
  onCompare,
  onView,
}: {
  college: College;
  removing: boolean;
  inCompare: boolean;
  animationDelay: number;
  onUnsave: () => void;
  onCompare: () => void;
  onView: () => void;
}) {
  return (
    <article
      className="card animate-fade-up"
      style={{
        animationDelay: `${animationDelay}ms`,
        opacity: removing ? 0.5 : 1,
        transition: "opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "1rem 1.1rem 0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className={`badge ${TYPE_COLORS[college.type] ?? "badge-private"}`}>
              {college.type}
            </span>
            {college.established && (
              <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 500 }}>
                Est. {college.established}
              </span>
            )}
          </div>
          <h3
            onClick={onView}
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "var(--text)",
              lineHeight: 1.3,
              cursor: "pointer",
              marginBottom: 4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {college.name}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>
            📍 {college.city}, {college.state}
          </p>
        </div>

        {/* Unsave button */}
        <button
          onClick={onUnsave}
          disabled={removing}
          aria-label="Remove from saved"
          style={{
            flexShrink: 0,
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1.5px solid var(--border)",
            background: "var(--surface)",
            cursor: removing ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            color: "var(--accent)",
            transition: "all 0.18s ease",
          }}
        >
          ♥
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.6rem 0.5rem",
          padding: "0.85rem 1.1rem",
        }}
      >
        <Stat label="Fees" value={formatFees(college.fees_min, college.fees_max)} />
        <Stat
          label="Rating"
          value={
            <>
              <span style={{ color: "var(--accent-2)" }}>★ </span>
              {college.rating.toFixed(1)}
            </>
          }
        />
        {college.placement_percent != null && (
          <Stat
            label="Placement"
            value={`${college.placement_percent}%`}
            accent
          />
        )}
        {college.avg_package != null && (
          <Stat
            label="Avg Package"
            value={`₹${(college.avg_package / 100000).toFixed(1)}L`}
          />
        )}
      </div>

      {/* Courses */}
      {college.courses.length > 0 && (
        <div
          style={{
            padding: "0 1.1rem 0.85rem",
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          {college.courses.slice(0, 3).map((c) => (
            <span
              key={c}
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                background: "var(--surface-2)",
                borderRadius: 99,
                color: "var(--text-2)",
                fontWeight: 500,
              }}
            >
              {c}
            </span>
          ))}
          {college.courses.length > 3 && (
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                background: "var(--surface-2)",
                borderRadius: 99,
                color: "var(--text-3)",
              }}
            >
              +{college.courses.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "0.75rem 1.1rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <button
          onClick={onCompare}
          className={`btn btn-sm ${inCompare ? "btn-primary" : "btn-secondary"}`}
        >
          {inCompare ? "✓ In Compare" : "+ Compare"}
        </button>
        <button onClick={onView} className="btn btn-secondary btn-sm">
          View Details →
        </button>
      </div>
    </article>
  );
}

// ── Stat ──────────────────────────────────────────────────────────────────────
function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "0.68rem",
          color: "var(--text-3)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: accent ? "var(--govt)" : "var(--text)",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SavedCardSkeleton() {
  return (
    <div className="card" style={{ overflow: "hidden", padding: "1rem 1.1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 18, width: "85%", marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 13, width: "50%" }} />
        </div>
        <div className="skeleton" style={{ width: 34, height: 34, borderRadius: "50%" }} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton" style={{ height: 10, width: "50%", marginBottom: 4 }} />
            <div className="skeleton" style={{ height: 14, width: "70%" }} />
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div className="skeleton" style={{ height: 32, borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 32, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}