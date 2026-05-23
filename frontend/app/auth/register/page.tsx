"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.push("/colleges");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: "var(--accent)",
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1.2rem",
              marginBottom: "0.75rem",
            }}
          >
            M
          </div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1.6rem",
              marginBottom: "0.35rem",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>
            Free forever. Save colleges, compare, decide.
          </p>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  background: "rgba(232,82,42,0.08)",
                  border: "1px solid rgba(232,82,42,0.25)",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                  marginBottom: "1.25rem",
                  color: "var(--accent)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <label className="label" htmlFor="name">Full Name</label>
              <input
                id="name"
                className="input"
                type="text"
                autoComplete="name"
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="label" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                className="input"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.875rem",
            color: "var(--text-2)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}