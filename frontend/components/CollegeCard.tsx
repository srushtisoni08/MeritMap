"use client";

import Link from "next/link";
import type { College } from "../lib/types";
import { useCompare } from "../context/CompareContext";
import { useAuth } from "../context/AuthContext";
import { saveCollege, unsaveCollege } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { useState } from "react";

interface Props {
  college: College;
  savedIds?: number[];
  onSaveToggle?: (id: number, saved: boolean) => void;
  animationDelay?: number;
}

function formatFees(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
      : `₹${(n / 1000).toFixed(0)}K`;
  return `${fmt(min)} – ${fmt(max)}`;
}

function Stars({ rating }: { rating: number | null }) {
  if (rating == null) return null;
  const r = Number(rating);
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  return (
    <span className="stars" style={{ fontSize: "0.85rem" }}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return "★";
        if (i === full && half) return "½";
        return "☆";
      }).join("")}
    </span>
  );
}

const TYPE_COLORS: Record<string, string> = {
  Government: "badge-govt",
  Private: "badge-private",
  Deemed: "badge-deemed",
};

export default function CollegeCard({
  college,
  savedIds = [],
  onSaveToggle,
  animationDelay = 0,
}: Props) {
  const { compareList, addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const inCompare = isInCompare(college.id);
  const isSaved = savedIds.includes(college.id);
  const compareDisabled = !inCompare && compareList.length >= 3;

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      toast("Please login to save colleges", "info");
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveCollege(college.id);
        toast("Removed from saved", "info");
        onSaveToggle?.(college.id, false);
      } else {
        await saveCollege(college.id);
        toast("College saved!", "success");
        onSaveToggle?.(college.id, true);
      }
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(college.id);
    } else if (!compareDisabled) {
      addToCompare(college);
      toast(`${college.name} added to compare`, "success");
    } else {
      toast("You can compare up to 3 colleges at once", "info");
    }
  }

  const imgSrc =
    college.image_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&size=400&background=e8522a&color=fff&bold=true&length=2`;

  return (
    <Link
      href={`/colleges/${college.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        className="card animate-fade-up"
        style={{
          animationDelay: `${animationDelay}ms`,
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
          <img
            src={imgSrc}
            alt={college.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(26,23,20,0.45) 0%, transparent 60%)",
            }}
          />
          {/* Type badge */}
          <span
            className={`badge ${TYPE_COLORS[college.type] ?? "badge-private"}`}
            style={{ position: "absolute", top: 10, left: 10 }}
          >
            {college.type}
          </span>
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            aria-label={isSaved ? "Remove from saved" : "Save college"}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "none",
              background: isSaved ? "var(--accent)" : "rgba(255,255,255,0.85)",
              cursor: saving ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              transition: "all 0.18s ease",
              backdropFilter: "blur(4px)",
            }}
          >
            {isSaved ? "♥" : "♡"}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
          <h3
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 4,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {college.name}
          </h3>

          <p style={{ fontSize: "0.8rem", color: "var(--text-2)", marginBottom: 10 }}>
            📍 {college.city}, {college.state}
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 4px",
              marginBottom: 12,
            }}
          >
            <Stat label="Fees" value={formatFees(college.fees_min, college.fees_max)} />
            <Stat
  label="Rating"
  value={
    college.rating != null
  ? <><Stars rating={Number(college.rating)} /> {Number(college.rating).toFixed(1)}</>
  : "N/A"
  }
/>
            {college.placement_percent != null && (
              <Stat label="Placement" value={`${college.placement_percent}%`} accent />
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
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
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

          {/* Compare button */}
          <button
            onClick={handleCompare}
            className={`btn btn-sm ${inCompare ? "btn-primary" : "btn-secondary"}`}
            style={{
              width: "100%",
              opacity: compareDisabled ? 0.5 : 1,
              cursor: compareDisabled ? "not-allowed" : "pointer",
            }}
          >
            {inCompare ? "✓ In Compare" : compareDisabled ? "Compare full (3/3)" : "+ Compare"}
          </button>
        </div>
      </article>
    </Link>
  );
}

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
      <div style={{ fontSize: "0.68rem", color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "0.82rem",
          fontWeight: 600,
          color: accent ? "var(--govt)" : "var(--text)",
          marginTop: 1,
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