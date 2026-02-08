"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ManagerDashboard from "@/components/dashboards/ManagerDashboard";
import OwnerDashboard from "@/components/dashboards/OwnerDashboard";
import DirectorDashboard from "@/components/dashboards/DirectorDashboard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("👤 Usuário logado:", user.email);
      console.log("🔑 Role:", user.user_metadata?.role);
    }
  }, [user]);

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          background: "#f4f7f6",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div className="spinner"></div>{" "}
        {/* Pode-se adicionar spinner CSS aqui */}
        <p>Carregando sistema...</p>
      </div>
    );

  if (!user) return null; // Será redirecionado pelo AuthContext

  // Roteamento baseado em Papel (Role-Based Routing)
  const role = user.user_metadata?.role;

  if (role === "owner") {
    return <OwnerDashboard user={user} />;
  }

  if (role === "director") {
    return <DirectorDashboard user={user} />;
  }

  // Default: 'manager', 'admin', 'user' veem o ManagerDashboard
  return <ManagerDashboard user={user} />;
}
