"use client";
import React, { useEffect, useState, useRef } from "react";
import { User, api } from "@/services/api";
import Header from "@/components/Header";
import ManagerDashboard from "./ManagerDashboard";
// Diretor NÃO tem acesso ao ManagerManagement (Gestão de Equipe)

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  BarController,
  DoughnutController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  BarController,
  DoughnutController,
);

// Reutiliza estilos (simplificado para exemplo)
const styles = {
  dashboardContainer: {
    display: "grid",
    gridTemplateColumns: "minmax(250px, 300px) 1fr",
    gap: "2rem",
    maxWidth: "1400px",
    margin: "2rem auto",
    padding: "0 2rem",
  },
  sidebar: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    height: "fit-content",
  },
  content: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2rem",
  },
  btn: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    width: "100%",
    marginTop: "1rem",
  },
  btnPrimary: {
    background: "#3498db", // Azul para Diretor (diferenciar do dono)
    color: "white",
  },
  analysisSection: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};

export default function DirectorDashboard({ user }: { user: User }) {
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    api.getTeam().then((data) => {
      // Diretor vê apenas gerentes para supervisionar
      const managers = data.filter((u: any) => u.role === "manager");
      setTeam(managers);
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", color: "#333" }}>
      <Header />

      <div style={styles.dashboardContainer}>
        {/* Sidebar Simplificada para Diretor */}
        <aside style={styles.sidebar}>
          <h2
            style={{
              fontSize: "1.2rem",
              marginBottom: "1.5rem",
              color: "#3498db",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
            }}
          >
            Diretoria
          </h2>

          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "2rem",
            }}
          >
            <button
              onClick={() => setSelectedManager(null)}
              style={{
                ...styles.btn,
                marginTop: 0,
                background: !selectedManager ? "#3498db" : "transparent",
                color: !selectedManager ? "white" : "#555",
                border: !selectedManager ? "none" : "1px solid #ddd",
                textAlign: "left",
              }}
            >
              � Lista de Gerentes
            </button>
            {/* Futuro: Adicionar Reports Consolidados aqui */}
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main style={styles.content}>
          {/* Removemos a lógica de abas complexas, foco direto na lista ou detalhe */}
          {selectedManager ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <button
                  onClick={() => setSelectedManager(null)}
                  style={{
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    border: "none",
                    background: "#ecf0f1",
                    borderRadius: "4px",
                    fontWeight: 600,
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  ⬅️ Voltar para Lista
                </button>
                <h3 style={{ margin: 0, color: "#2c3e50" }}>
                  Carteira de: {selectedManager.name}
                </h3>
              </div>

              <div
                style={{
                  border: "2px solid #3498db",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  maxHeight: "calc(100vh - 200px)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Barra Superior do Modo Supervisão */}
                <div
                  style={{
                    background: "#3498db",
                    color: "white",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "1rem", fontWeight: 500 }}>
                    👁️ Modo Supervisão
                  </span>
                  <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                    Visualizando como: {selectedManager.email}
                  </span>
                </div>

                <div
                  style={{
                    overflowY: "auto",
                    flex: 1,
                    background: "#f4f7f6",
                  }}
                >
                  {/* Reuse ManagerDashboard but pass targetUser */}
                  <ManagerDashboard user={user} targetUser={selectedManager} />
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.analysisSection}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                  color: "#2D4471",
                }}
              >
                Equipe de Gerentes
              </h2>
              <p style={{ color: "#666", marginBottom: "2rem" }}>
                Selecione um gerente para acessar sua carteira de clientes e
                supervisionar o desempenho.
              </p>

              {team.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px dashed #ccc",
                  }}
                >
                  <p style={{ color: "#666" }}>
                    Nenhum gerente encontrado no sistema no momento.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {team.map((manager: any) => (
                    <div
                      key={manager.id}
                      onClick={() => setSelectedManager(manager)}
                      style={{
                        padding: "1.5rem",
                        background: "#fff",
                        border: "1px solid #e0e0e0",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#3498db";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(52, 152, 219, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e0e0e0";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 4px rgba(0,0,0,0.05)";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #3498db, #2980b9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            boxShadow: "0 4px 6px rgba(52, 152, 219, 0.3)",
                          }}
                        >
                          {manager.name
                            ? manager.name.charAt(0).toUpperCase()
                            : "G"}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: "1rem",
                              color: "#2c3e50",
                              margin: 0,
                              fontWeight: 700,
                            }}
                          >
                            {manager.name || "Gerente"}
                          </h3>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "#7f8c8d",
                            }}
                          >
                            Gerente de Contas
                          </span>
                        </div>
                      </div>

                      <div style={{ marginTop: "0.5rem" }}>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "#555",
                            marginBottom: "4px",
                          }}
                        >
                          📧 <strong>Email:</strong> {manager.email}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#555" }}>
                          🆔 <strong>ID:</strong> {manager.id.substring(0, 8)}
                          ...
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "auto",
                          paddingTop: "12px",
                          borderTop: "1px solid #f0f0f0",
                          color: "#3498db",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          textAlign: "center",
                          background: "#fcfcfc",
                          margin: "0 -1.5rem -1.5rem -1.5rem",
                          padding: "1rem",
                        }}
                      >
                        Acessar Dashboard →
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
