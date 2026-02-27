export default function Topbar({ page, onNavigate, onOpenSidebar }) {
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="hamburger" onClick={onOpenSidebar} aria-label="Buka menu">
          <span /><span /><span />
        </button>
        <div>
          <h1 style={{ fontWeight: 800, color: "#002960", fontSize: 18 }}>
            {page === "dashboard" ? "Dashboard Produksi" : "Input & Kelola Data"}
          </h1>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            {page === "dashboard"
              ? "Data real-time per hari ini"
              : "Tambah, edit, atau hapus data produksi"}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          className="topbar-date"
          style={{
            fontSize: 12, color: "#94a3b8",
            background: "#f9fafb", border: "1px solid #f1f5f9",
            borderRadius: 10, padding: "8px 12px",
          }}
        >
          📅 {dateStr}
        </div>

        {page === "dashboard" ? (
          <button className="btn-primary" onClick={() => onNavigate("crud")}>
            ＋ <span className="btn-text">Tambah Data</span>
          </button>
        ) : (
          <button className="btn-navy" onClick={() => onNavigate("dashboard")}>
            ← <span className="btn-text">Kembali ke Dashboard</span>
          </button>
        )}
      </div>
    </header>
  );
}
