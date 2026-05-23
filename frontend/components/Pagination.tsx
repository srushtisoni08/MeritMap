"use client";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "1.5rem 0",
      }}
      aria-label="Pagination"
    >
      <PagBtn
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        label="← Prev"
      />
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} style={{ color: "var(--text-3)", padding: "0 4px" }}>
            …
          </span>
        ) : (
          <PagBtn
            key={p}
            onClick={() => onPageChange(p as number)}
            active={p === page}
            label={String(p)}
          />
        )
      )}
      <PagBtn
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        label="Next →"
      />
    </nav>
  );
}

function PagBtn({
  onClick,
  disabled,
  active,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 36,
        height: 36,
        padding: "0 10px",
        borderRadius: 8,
        border: active ? "none" : "1.5px solid var(--border)",
        background: active ? "var(--accent)" : disabled ? "var(--surface-2)" : "var(--surface)",
        color: active ? "#fff" : disabled ? "var(--text-3)" : "var(--text)",
        fontFamily: "Syne, sans-serif",
        fontWeight: 600,
        fontSize: "0.85rem",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </button>
  );
}