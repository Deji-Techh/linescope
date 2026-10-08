import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DashboardShell } from "@/components/dashboard-shell";
import "./styles/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("LineScope root element not found.");
}

createRoot(root).render(
  <StrictMode>
    <DashboardShell initialMode={window.location.pathname === "/replay" ? "Replay Mode" : "Mock Mode"} />
  </StrictMode>,
);
