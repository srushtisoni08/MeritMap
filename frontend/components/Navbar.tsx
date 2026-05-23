"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const { compareList } = useCompare();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/colleges", label: "Colleges" },
    { href: "/compare", label: "Compare" },
    { href: "/predict", label: "Predictor" },
    { href: "/saved", label: "Saved" },
  ];

  function handleLogout() {
    logout();
    router.push("/");
    setMenuOpen(false);
  }

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 64,
        background: scrolled ? "rgba(247,244,239,0.92)" : "var(--bg)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.25s ease",
      }}
    >
      <div
        className="page-container"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "var(--text)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              background: "var(--accent)",
              borderRadius: 6,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 800,
            }}
          >
            M
          </span>
          MeritMap
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                position: "relative",
                fontFamily: "Syne, sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: pathname.startsWith(l.href) ? "var(--accent)" : "var(--text-2)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
                transition: "color 0.18s ease, background 0.18s ease",
                background: pathname.startsWith(l.href) ? "rgba(232,82,42,0.08)" : "transparent",
              }}
            >
              {l.label}
              {l.href === "/compare" && compareList.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 16,
                    height: 16,
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {compareList.length}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden-mobile">
          {isLoggedIn ? (
            <>
              <span
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "0.82rem",
                  color: "var(--text-2)",
                  fontWeight: 600,
                }}
              >
                Hi, {user?.name.split(" ")[0]}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
          }}
        >
          <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  height: 2,
                  background: "var(--text)",
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  transformOrigin: "center",
                  transform:
                    menuOpen
                      ? i === 0
                        ? "rotate(45deg) translateY(7px)"
                        : i === 2
                        ? "rotate(-45deg) translateY(-7px)"
                        : "scaleX(0)"
                      : "none",
                }}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          className="mobile-menu"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: pathname.startsWith(l.href) ? "var(--accent)" : "var(--text)",
                textDecoration: "none",
                padding: "10px 12px",
                borderRadius: 8,
                background: pathname.startsWith(l.href) ? "rgba(232,82,42,0.08)" : "transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {l.label}
              {l.href === "/compare" && compareList.length > 0 && (
                <span
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: "99px",
                    padding: "2px 8px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {compareList.length}
                </span>
              )}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4, display: "flex", gap: 8 }}>
            {isLoggedIn ? (
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleLogout}>
                Logout ({user?.name.split(" ")[0]})
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/auth/register" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}