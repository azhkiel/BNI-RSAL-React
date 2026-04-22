import { LayoutDashboard, FilePen, FileSpreadsheet, X, Building2 } from "lucide-react";

export default function Sidebar({ page, onNavigate, isOpen, onClose }) {
  
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={"sidebar-overlay" + (isOpen ? " active" : "")}
        onClick={onClose}
      />

      <aside className={"sidebar" + (isOpen ? " open" : "")}>

        {/* Close button — visible on mobile only via CSS if needed */}
        <button
          onClick={onClose}
          aria-label="Tutup sidebar"
          style={{
            position: "absolute", top: 16, right: 16,
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 8, background: "rgba(255,255,255,0.12)",
            color: "white", border: "none", cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        >
          <X size={16} />
        </button>

        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "0 4px", marginBottom: 32, marginTop: 4,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Building2 size={22} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>
              BNI Life
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 1 }}>
              Insurance
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="section-label">Menu Utama</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            className={"nav-item" + (page === "dashboard" ? " active" : "")}
            onClick={() => { onNavigate("dashboard"); onClose(); }}
          >
            <LayoutDashboard size={17} style={{ flexShrink: 0 }} />
            Dashboard
          </button>

          <button
            className={"nav-item" + (page === "crud" ? " active" : "")}
            onClick={() => { onNavigate("crud"); onClose(); }}
          >
            <FilePen size={17} style={{ flexShrink: 0 }} />
            Input / Edit Data
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/1MPb4aMPFwzZM_xheqP_Gzrxf8Gn-eMxa-NOyqRekJgQ/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="nav-item"
            onClick={onClose}
          >
            <FileSpreadsheet size={17} style={{ flexShrink: 0 }} />
            Data Excel
          </a>
        </nav>

        {/* Bottom info */}
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <div style={{
            borderRadius: 12, padding: "12px 14px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4 }}>
              Versi
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
              Dashboard Produksi 2025
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}