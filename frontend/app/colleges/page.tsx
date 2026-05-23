"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchColleges, fetchStates, fetchSavedIds } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { College, Pagination as PaginationType } from "@/lib/types";
import CollegeCard from "@/components/CollegeCard";
import CollegeCardSkeleton from "@/components/CollegeCardSkeleton";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

const COLLEGE_TYPES = ["Government", "Private", "Deemed"];
const FEES_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Under ₹1L", value: "100000" },
  { label: "Under ₹3L", value: "300000" },
  { label: "Under ₹5L", value: "500000" },
  { label: "Under ₹10L", value: "1000000" },
];
const SORT_OPTIONS = [
  { label: "Top Rated", value: "rating" },
  { label: "Best Placement", value: "placement_percent" },
  { label: "Lowest Fees", value: "fees_min:asc" },
  { label: "Name A–Z", value: "name:asc" },
];

export default function CollegesPage() {
  const { isLoggedIn } = useAuth();

  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [feesMax, setFeesMax] = useState("");
  const [sort, setSort] = useState("rating");
  const [page, setPage] = useState(1);

  // Load states once
  useEffect(() => {
    fetchStates().then((r) => setStates(r.states)).catch(() => {});
  }, []);

  // Load saved IDs when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedIds().then((r) => setSavedIds(r.ids)).catch(() => {});
    } else {
      setSavedIds([]);
    }
  }, [isLoggedIn]);

  const loadColleges = useCallback(async () => {
    setLoading(true);
    try {
      const [sortCol, sortDir] = sort.includes(":") ? sort.split(":") : [sort, "desc"];
      const res = await fetchColleges({
        search: search || undefined,
        state: state || undefined,
        type: type || undefined,
        fees_max: feesMax || undefined,
        sort: sortCol as "rating" | "fees_min" | "placement_percent" | "name",
        order: (sortDir ?? "desc") as "asc" | "desc",
        page: String(page),
        limit: "12",
      });
      setColleges(res.data);
      setPagination(res.pagination);
    } catch {
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, [search, state, type, feesMax, sort, page]);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, state, type, feesMax, sort]);

  function handleSaveToggle(id: number, saved: boolean) {
    setSavedIds((prev) =>
      saved ? [...prev, id] : prev.filter((x) => x !== id)
    );
  }

  function clearFilters() {
    setSearch("");
    setState("");
    setType("");
    setFeesMax("");
    setSort("rating");
    setPage(1);
  }

  const hasFilters = search || state || type || feesMax;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "2rem 0 0",
          marginBottom: "2rem",
        }}
      >
        <div className="page-container">
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              fontWeight: 800,
              marginBottom: "0.35rem",
            }}
          >
            Explore Colleges
          </h1>
          {pagination && (
            <p style={{ color: "var(--text-2)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              {pagination.total.toLocaleString()} colleges found
            </p>
          )}

          {/* Search */}
          <div style={{ maxWidth: 560, marginBottom: "1.25rem" }}>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Filter row */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              paddingBottom: "1.25rem",
              alignItems: "center",
            }}
          >
            {/* State */}
            <select
              className="input"
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{ width: "auto", minWidth: 140 }}
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Type */}
            <div style={{ display: "flex", gap: 6 }}>
              {COLLEGE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(type === t ? "" : t)}
                  className="btn btn-sm"
                  style={{
                    background: type === t ? "var(--text)" : "var(--surface)",
                    color: type === t ? "#fff" : "var(--text-2)",
                    border: `1.5px solid ${type === t ? "var(--text)" : "var(--border)"}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Fees */}
            <select
              className="input"
              value={feesMax}
              onChange={(e) => setFeesMax(e.target.value)}
              style={{ width: "auto", minWidth: 140 }}
            >
              {FEES_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: "auto", minWidth: 160, marginLeft: "auto" }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="page-container">
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <CollegeCardSkeleton key={i} />
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "1.2rem",
                marginBottom: "0.5rem",
              }}
            >
              No colleges found
            </h3>
            <p style={{ color: "var(--text-2)", marginBottom: "1.5rem" }}>
              Try adjusting your search or filters
            </p>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {colleges.map((c, i) => (
                <CollegeCard
                  key={c.id}
                  college={c}
                  savedIds={savedIds}
                  onSaveToggle={handleSaveToggle}
                  animationDelay={i * 40}
                />
              ))}
            </div>

            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}