export default function Sidebar({ page, onNavigate, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={"sidebar-overlay" + (isOpen ? " active" : "")}
        onClick={onClose}
      />

      <aside className={"sidebar" + (isOpen ? " open" : "")}>
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 8, background: "rgba(255,255,255,0.12)",
            color: "white", border: "none", cursor: "pointer", fontSize: 16,
          }}
        >✕</button>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 12px", marginBottom: 32 }}>
          <div style={{ fontSize: 28 }}>🏦</div>
          <div style={{ color: "white", fontWeight: 800, fontSize: 16 }}>BNI Life</div>
        </div>

        {/* Nav */}
        <div className="section-label">Menu</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            className={"nav-item" + (page === "dashboard" ? " active" : "")}
            onClick={() => { onNavigate("dashboard"); onClose(); }}
          >
            <span>📊</span> Dashboard
          </button>
          <button
            className={"nav-item" + (page === "crud" ? " active" : "")}
            onClick={() => { onNavigate("crud"); onClose(); }}
          >
            <span>📝</span> Input / Edit Data
          </button>
          <a
            href="https://docs.google.com/spreadsheets/d/1MPb4aMPFwzZM_xheqP_Gzrxf8Gn-eMxa-NOyqRekJgQ/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="nav-item"
            onClick={onClose}
          >
            <span>📁</span> DATA EXCEL
          </a>
        </nav>

        {/* Bottom info */}
        <div style={{ marginTop: "auto" }}>
          <div className="period-bar">
            <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 4 }}>
              Periode Aktif
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              Januari — Desember 2025
            </div>
            <div style={{ marginTop: 8, height: 6, borderRadius: 20, background: "rgba(255,255,255,0.15)" }}>
              <div style={{ height: 6, borderRadius: 20, background: "#F37021", width: "42%" }} />
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: "rgba(255,255,255,0.5)" }}>
              42% dari target tahunan
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
