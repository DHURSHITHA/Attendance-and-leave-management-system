import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { useState } from "react";

export default function DashboardLayout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="content-shell">
        <Topbar onMenuClick={() => setSidebarOpen((s) => !s)} />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
