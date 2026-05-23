"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search colleges, cities, courses…",
}: Props) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes
  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setLocal(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 400);
  }

  function clear() {
    setLocal("");
    onChange("");
  }

  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "1rem",
          color: "var(--text-3)",
          pointerEvents: "none",
        }}
      >
        🔍
      </span>
      <input
        className="input"
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ paddingLeft: "2.5rem", paddingRight: local ? "2.5rem" : "1rem" }}
      />
      {local && (
        <button
          onClick={clear}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "var(--surface-2)",
            border: "none",
            borderRadius: "50%",
            width: 22,
            height: 22,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            color: "var(--text-2)",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}