import { useState, useEffect, useCallback } from "react";
import { getAllData } from "./api";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import Crud from "./pages/Crud";
import "./global.css";

export default function App() {
  const [page, setPage]           = useState("dashboard");
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [sidebarOpen, setSidebar] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const d = await getAllData();
      setData(d);
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Close sidebar when clicking outside on mobile
  const handleNavigate = (newPage) => {
    setPage(newPage);
    setSidebar(false);
  };

  return (
    /*
      .page-bg uses flex-direction: row.
      Sidebar is position:fixed (doesn't take up flow space).
      .main-wrapper has margin-left: var(--sidebar-w) on desktop
      to push content past the fixed sidebar.
      On mobile (≤1023px) margin-left resets to 0 and
      sidebar slides in as an overlay.
    */
    <div className="page-bg">
      <Sidebar
        page={page}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebar(false)}
      />

      {/* Everything to the right of the sidebar */}
      <div className="main-wrapper">
        <Topbar
          page={page}
          onNavigate={handleNavigate}
          onOpenSidebar={() => setSidebar(true)}
        />

        {/* Page content */}
        <main style={{ flex: "1 1 auto", minWidth: 0, overflowX: "hidden" }}>
          {page === "dashboard" ? (
            <Dashboard data={data} loading={loading} onNavigate={handleNavigate} />
          ) : (
            <Crud data={data} loading={loading} onRefresh={loadData} />
          )}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav page={page} onNavigate={handleNavigate} />
    </div>
  );
}