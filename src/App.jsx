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

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="page-bg">
      <Sidebar
        page={page}
        onNavigate={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebar(false)}
      />

      <div className="main-wrapper">
        <Topbar
          page={page}
          onNavigate={setPage}
          onOpenSidebar={() => setSidebar(true)}
        />

        {page === "dashboard" ? (
          <Dashboard data={data} loading={loading} onNavigate={setPage} />
        ) : (
          <Crud data={data} loading={loading} onRefresh={loadData} />
        )}
      </div>

      <BottomNav page={page} onNavigate={setPage} />
    </div>
  );
}
