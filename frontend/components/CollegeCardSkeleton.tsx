export default function CollegeCardSkeleton() {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="skeleton" style={{ height: 160 }} />
      <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
        <div className="skeleton" style={{ height: 18, marginBottom: 8, width: "85%" }} />
        <div className="skeleton" style={{ height: 14, marginBottom: 14, width: "55%" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="skeleton" style={{ height: 10, marginBottom: 4, width: "50%" }} />
              <div className="skeleton" style={{ height: 14, width: "70%" }} />
            </div>
          ))}
        </div>
        <div className="skeleton" style={{ height: 32, borderRadius: 8 }} />
      </div>
    </div>
  );
}