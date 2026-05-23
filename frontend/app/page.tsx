import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section
        style={{
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,82,42,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -100,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(247,192,90,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="page-container" style={{ width: "100%", paddingTop: "3rem", paddingBottom: "3rem" }}>
          <div style={{ maxWidth: 680 }}>
            <div
              className="animate-fade-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(232,82,42,0.08)",
                border: "1px solid rgba(232,82,42,0.2)",
                borderRadius: 99,
                padding: "6px 14px",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ fontSize: "0.75rem", fontWeight: 700, fontFamily: "Syne, sans-serif", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                🎓 India's smartest college finder
              </span>
            </div>

            <h1
              className="animate-fade-up"
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.2rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                color: "var(--text)",
                marginBottom: "1.5rem",
                animationDelay: "60ms",
              }}
            >
              Find the college
              <br />
              <span style={{ color: "var(--accent)" }}>you deserve.</span>
            </h1>

            <p
              className="animate-fade-up"
              style={{
                fontSize: "1.15rem",
                color: "var(--text-2)",
                lineHeight: 1.7,
                marginBottom: "2.5rem",
                maxWidth: 520,
                animationDelay: "120ms",
              }}
            >
              Search, compare and shortlist from thousands of colleges across India. Filter by fees, location, courses and placement stats — all in one place.
            </p>

            <div
              className="animate-fade-up"
              style={{ display: "flex", gap: 12, flexWrap: "wrap", animationDelay: "180ms" }}
            >
              <Link href="/colleges" className="btn btn-primary btn-lg">
                Explore Colleges →
              </Link>
              <Link href="/compare" className="btn btn-secondary btn-lg">
                Compare Colleges
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          background: "var(--text)",
          color: "#fff",
          padding: "2rem 0",
        }}
      >
        <div
          className="page-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1.5rem",
            textAlign: "center",
          }}
        >
          {[
            { num: "500+", label: "Colleges listed" },
            { num: "28", label: "States covered" },
            { num: "50+", label: "Courses tracked" },
            { num: "Free", label: "Always" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--accent-2)",
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "5rem 0" }}>
        <div className="page-container">
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "0.75rem",
            }}
          >
            Everything you need to decide
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-2)",
              marginBottom: "3rem",
              fontSize: "1rem",
            }}
          >
            No more tab-switching. All the data, one platform.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              {
                icon: "🔍",
                title: "Smart Search",
                desc: "Filter by state, fees range, college type and course. Results update instantly.",
                href: "/colleges",
                cta: "Search colleges",
              },
              {
                icon: "⚖️",
                title: "Side-by-Side Compare",
                desc: "Pick 2–3 colleges and see fees, placement %, rating and packages in one table.",
                href: "/compare",
                cta: "Compare now",
              },
              {
                icon: "♥",
                title: "Save & Shortlist",
                desc: "Create a free account and bookmark colleges to revisit later.",
                href: "/auth/register",
                cta: "Get started",
              },
              {
                icon: "📊",
                title: "Placement Data",
                desc: "See average and highest packages, placement percentages for every college.",
                href: "/colleges",
                cta: "Explore data",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="card animate-fade-up"
                style={{
                  padding: "1.75rem",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  {f.desc}
                </p>
                <Link
                  href={f.href}
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    color: "var(--accent)",
                    textDecoration: "none",
                  }}
                >
                  {f.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "4rem 0 6rem" }}>
        <div className="page-container" style={{ textAlign: "center" }}>
          <div
            style={{
              background: "var(--text)",
              borderRadius: "var(--radius-lg)",
              padding: "3.5rem 2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: "rgba(232,82,42,0.15)",
                pointerEvents: "none",
              }}
            />
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "1rem",
              }}
            >
              Start your college search today
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "2rem", fontSize: "1rem" }}>
              Free forever. No spam. Just the right college for you.
            </p>
            <Link href="/colleges" className="btn btn-primary btn-lg">
              Browse All Colleges →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}