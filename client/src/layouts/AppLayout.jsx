import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Video,
  Bell,
  Calendar,
  Clock,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { id: "home", Icon: Home, label: "Home", path: "/dashboard" },
  { id: "chat", Icon: MessageSquare, label: "Messages", path: "/messages" },
  { id: "video", Icon: Video, label: "Meetings", path: "/meetings" },
  { id: "bell", Icon: Bell, label: "Notifications", path: "/notifications" },
  { id: "cal", Icon: Calendar, label: "Calendar", path: "/calendar" },
  { id: "history", Icon: Clock, label: "History", path: "/history" },
];

function SidebarNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const activeId =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.id ??
    "home";

  return (
    <nav style={S.sidebar}>
      <div style={S.sidebarLogo}>
        <Video size={18} color="#fff" strokeWidth={2} />
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
      >
        {NAV_ITEMS.map(({ id, Icon, label, path }) => (
          <button
            key={id}
            aria-label={label}
            title={label}
            onClick={() => navigate(path)}
            style={{
              ...S.navBtn,
              background: activeId === id ? "#eef1ff" : "transparent",
              color: activeId === id ? "#4f6ef7" : "#999",
            }}
          >
            <Icon size={19} strokeWidth={1.8} />
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <button
          onClick={() => navigate("/settings")}
          title="Settings"
          aria-label="Settings"
          style={{
            ...S.navBtn,
            background: location.pathname.startsWith("/settings")
              ? "#eef1ff"
              : "transparent",
            color: location.pathname.startsWith("/settings")
              ? "#4f6ef7"
              : "#999",
          }}
        >
          <Settings size={19} strokeWidth={1.8} />
        </button>
        <button
          onClick={logout}
          style={{ ...S.navBtn, color: "#999" }}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={19} strokeWidth={1.8} />
        </button>
      </div>
    </nav>
  );
}

export function AppLayout({ children }) {
  return (
    <div style={S.page}>
      <SidebarNav />
      <motion.div
        style={S.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default AppLayout;

const S = {
  page: {
    display: "flex",
    height: "100vh",
    background: "#eef1fb",
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: "hidden",
  },
  sidebar: {
    width: 58,
    background: "#fff",
    borderRight: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px 0",
    gap: 4,
    flexShrink: 0,
  },

  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, color 0.15s",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    overflowX: "hidden",
    minWidth: 0,
  },
};
