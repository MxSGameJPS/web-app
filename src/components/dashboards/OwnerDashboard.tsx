"use client";
import React, { useEffect, useState, useRef } from "react";
import { User, api } from "@/services/api";
import Header from "@/components/Header";
import ManagerManagement from "@/components/ManagerManagement";
import ManagerDashboard from "./ManagerDashboard"; // Importando o componente correto
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

// Estilos convertidos do CSS original para CSS-in-JS (ou poderia ser module.css)
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
  kpiContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  kpiCard: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
    borderLeft: "4px solid #2a9d8f",
  },
  kpiValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#2a9d8f",
    margin: "0.5rem 0",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  chartCard: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  analysisSection: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  alertCard: {
    padding: "1rem",
    borderRadius: "8px",
    margin: "1rem 0",
    border: "1px solid",
  },
  alertWarning: {
    background: "#fff3cd",
    borderColor: "#ffc107",
  },
  alertDanger: {
    background: "#f8d7da",
    borderColor: "#dc3545",
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
    background: "#2a9d8f",
    color: "white",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    margin: "1rem 0",
  },
  th: {
    padding: "0.75rem",
    textAlign: "left" as const,
    borderBottom: "1px solid #e0e0e0",
    background: "#f8f9fa",
    fontWeight: 600,
  },
  td: {
    padding: "0.75rem",
    textAlign: "left" as const,
    borderBottom: "1px solid #e0e0e0",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "#e9ecef",
    borderRadius: "4px",
    overflow: "hidden",
    margin: "0.5rem 0",
  },
  suggestionCard: {
    background: "#d1ecf1",
    border: "1px solid #bee5eb",
    padding: "1rem",
    borderRadius: "8px",
    margin: "0.5rem 0",
  },
};

export default function OwnerDashboard({ user }: { user: User }) {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "team" | "wallets"
  >("dashboard");
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    if (currentView === "wallets") {
      api.getTeam().then((data) => {
        // Filtra para mostrar apenas gerentes e diretores
        const managers = data.filter(
          (u: any) => u.role === "manager" || u.role === "director",
        );
        setTeam(managers);
      });
    }
  }, [currentView]);

  // Dados de demonstração (Estado)
  const [demoData] = useState({
    totalVisits: 156,
    uniqueClients: 28,
    totalClients: 67,
    visitsDistribution: [
      {
        client: "Hospital Santa Clara",
        visits: 42,
        percentage: 27,
        lastVisit: "2024-01-15",
        status: "Excesso",
      },
      {
        client: "Clínica São Lucas",
        visits: 28,
        percentage: 18,
        lastVisit: "2024-01-18",
        status: "Excesso",
      },
      {
        client: "Maternidade Esperança",
        visits: 24,
        percentage: 15,
        lastVisit: "2024-01-20",
        status: "Excesso",
      },
      {
        client: "Laboratório Central",
        visits: 18,
        percentage: 12,
        lastVisit: "2024-01-22",
        status: "Adequado",
      },
      {
        client: "Centro Médico Alfa",
        visits: 15,
        percentage: 10,
        lastVisit: "2024-01-25",
        status: "Adequado",
      },
      {
        client: "Outros 23 clientes",
        visits: 29,
        percentage: 18,
        lastVisit: "Varia",
        status: "Adequado",
      },
    ],
    neglectedClients: [
      "Consultório Delta",
      "Clínica Omega",
      "Hospital Beta",
      "Unidade Gama",
      "Ambulatório Zeta",
      "Laboratório Theta",
      "Posto Iota",
      "Centro Kappa",
    ],
  });

  // Cálculos derivados
  const coverageRate = Math.round(
    (demoData.uniqueClients / demoData.totalClients) * 100,
  );
  const efficiency =
    100 -
    Math.round(
      (demoData.visitsDistribution[0].percentage +
        demoData.visitsDistribution[1].percentage +
        demoData.visitsDistribution[2].percentage) /
        3,
    );

  // Configuração dos Gráficos
  const barData = {
    labels: demoData.visitsDistribution.map((item) => item.client),
    datasets: [
      {
        label: "Número de Visitas",
        data: demoData.visitsDistribution.map((item) => item.visits),
        backgroundColor: [
          "#e76f51",
          "#e76f51",
          "#e76f51",
          "#2a9d8f",
          "#2a9d8f",
          "#264653",
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutData = {
    labels: ["Clientes Visitados", "Clientes Não Visitados"],
    datasets: [
      {
        data: [
          demoData.uniqueClients,
          demoData.totalClients - demoData.uniqueClients,
        ],
        backgroundColor: ["#2a9d8f", "#e9ecef"],
        borderWidth: 0,
      },
    ],
  };

  const generateReport = () => {
    alert(
      "📊 Relatório gerado com sucesso!\n\n" +
        `Total de Visitas: ${demoData.totalVisits}\n` +
        `Clientes Únicos: ${demoData.uniqueClients}\n` +
        `Taxa de Cobertura: ${coverageRate}%\n` +
        `Clientes Negligenciados: ${demoData.neglectedClients.length}`,
    );
  };

  const showOptimizationPlan = () => {
    const plan = `
🎯 PLANO DE OTIMIZAÇÃO - CURITIBA ESTERILIZAÇÃO

1. REDISTRIBUIÇÃO DE VISITAS:
   • Reduzir Hospital Santa Clara: 42 → 25 visitas/mês
   • Reduzir Clínica São Lucas: 28 → 18 visitas/mês  
   • Reduzir Maternidade Esperança: 24 → 15 visitas/mês
   • Realocar 36 visitas para clientes negligenciados

2. EXPANSÃO DE COBERTURA:
   • Visitar 8 clientes negligenciados prioritários
   • Aumentar cobertura de 42% para 65%
   • Meta: 45 clientes únicos/mês

3. OTIMIZAÇÃO DE ROTAS:
   • Agrupar por região geográfica
   • Reduzir tempo de deslocamento em 30%
   • Aumentar capacidade: +5 visitas/semana

IMPACTO ESPERADO:
✓ Cobertura: +23%
✓ Eficiência: +35% 
✓ Novos negócios: +15%
        `;
    alert(plan);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", color: "#333" }}>
      <Header />

      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Painel do Dono</h2>

          <nav className="sidebar-nav">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`btn-sidebar ${currentView === "dashboard" ? "active" : ""}`}
            >
              📊 Análise de Visitas
            </button>
            <button
              onClick={() => setCurrentView("team")}
              className={`btn-sidebar ${currentView === "team" ? "active" : ""}`}
            >
              👥 Gestão de Equipe
            </button>
            <button
              onClick={() => {
                setCurrentView("wallets");
                setSelectedManager(null);
              }}
              className={`btn-sidebar ${currentView === "wallets" ? "active" : ""}`}
            >
              📂 Visão Geral de Carteiras
            </button>
          </nav>

          {currentView === "dashboard" && (
            <>
              <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
                🔍 Filtros
              </h3>
              <div style={{ margin: "1rem 0" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  Período:
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <option value="last-month">Último Mês</option>
                  <option value="last-quarter">Último Trimestre</option>
                  <option value="last-year">Último Ano</option>
                </select>
              </div>

              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={generateReport}
              >
                📈 Gerar Relatório
              </button>
            </>
          )}
        </aside>

        {/* Conteúdo Principal */}
        <main className="content">
          {currentView === "team" ? (
            <ManagerManagement />
          ) : currentView === "wallets" ? (
            selectedManager ? (
              <div>
                <button
                  onClick={() => setSelectedManager(null)}
                  style={{
                    marginBottom: "1rem",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    border: "none",
                    background: "#ecf0f1",
                    borderRadius: "4px",
                    fontWeight: 600,
                    color: "#555",
                  }}
                >
                  ⬅️ Voltar para Lista
                </button>
                <div
                  style={{
                    border: "2px solid #2a9d8f",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      background: "#2a9d8f",
                      color: "white",
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>
                      👁️ Visualizando Carteira de:{" "}
                      <strong>
                        {selectedManager.name || selectedManager.email}
                      </strong>
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        background: "rgba(255,255,255,0.2)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Modo Supervisão
                    </span>
                  </div>
                  <div style={{ padding: "20px", background: "#f4f7f6" }}>
                    <ManagerDashboard
                      user={user}
                      targetUser={selectedManager}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.analysisSection}>
                <h2
                  style={{
                    fontSize: "1.2rem",
                    marginBottom: "1.5rem",
                    color: "#2D4471",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "10px",
                  }}
                >
                  📂 Selecione uma Carteira para Visualizar
                </h2>

                {team.length === 0 ? (
                  <p style={{ color: "#666" }}>
                    Carregando equipe ou nenhum gerente encontrado...
                  </p>
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
                          gap: "0.5rem",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#2a9d8f";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 16px rgba(42, 157, 143, 0.15)";
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
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "#e0f2f1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#2a9d8f",
                              fontWeight: "bold",
                            }}
                          >
                            {manager.name
                              ? manager.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              background:
                                manager.role === "manager"
                                  ? "#fff3cd"
                                  : "#d1ecf1",
                              color:
                                manager.role === "manager"
                                  ? "#856404"
                                  : "#0c5460",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontWeight: 600,
                            }}
                          >
                            {manager.role === "manager" ? "GERENTE" : "DIRETOR"}
                          </span>
                        </div>
                        <h3
                          style={{
                            fontSize: "1.1rem",
                            color: "#2D4471",
                            margin: 0,
                          }}
                        >
                          {manager.name || "Sem Nome"}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            color: "#666",
                            margin: 0,
                          }}
                        >
                          {manager.email}
                        </p>
                        <div
                          style={{
                            marginTop: "auto",
                            paddingTop: "10px",
                            borderTop: "1px solid #f0f0f0",
                            color: "#2a9d8f",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                          }}
                        >
                          Ver Carteira →
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            <>
              {/* KPIs */}
              <div style={styles.kpiContainer}>
                <div style={styles.kpiCard}>
                  <h3>Total de Visitas</h3>
                  <div style={styles.kpiValue}>{demoData.totalVisits}</div>
                  <small>No período selecionado</small>
                </div>
                <div style={styles.kpiCard}>
                  <h3>Clientes Visitados</h3>
                  <div style={styles.kpiValue}>{demoData.uniqueClients}</div>
                  <small>Clientes únicos</small>
                </div>
                <div style={styles.kpiCard}>
                  <h3>Taxa de Cobertura</h3>
                  <div style={styles.kpiValue}>{coverageRate}%</div>
                  <small>Da base total</small>
                </div>
                <div style={styles.kpiCard}>
                  <h3>Eficiência</h3>
                  <div style={styles.kpiValue}>{efficiency}%</div>
                  <small>Distribuição ideal</small>
                </div>
              </div>

              {/* Gráficos */}
              <div style={styles.chartGrid}>
                <div style={styles.chartCard}>
                  <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    📊 Distribuição de Visitas por Cliente
                  </h3>
                  <div style={{ height: "300px" }}>
                    <Chart
                      type="bar"
                      data={barData}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                </div>
                <div style={styles.chartCard}>
                  <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    🎯 Concentração vs Cobertura
                  </h3>
                  <div
                    style={{
                      height: "300px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Chart
                      type="doughnut"
                      data={doughnutData}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: "bottom" } },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Análise de Concentração e Tabelas */}
              <div style={styles.analysisSection}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                  ⚠️ Análise de Concentração
                </h2>

                <div style={{ ...styles.alertCard, ...styles.alertWarning }}>
                  <h4 style={{ marginBottom: "0.5rem" }}>
                    🔔 Alerta de Concentração
                  </h4>
                  <p>
                    <strong>60% das visitas</strong> estão concentradas em
                    apenas <strong>3 clientes</strong>
                  </p>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        width: "60%",
                        height: "100%",
                        background: "#2a9d8f",
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ ...styles.alertCard, ...styles.alertDanger }}>
                  <h4 style={{ marginBottom: "0.5rem" }}>
                    📉 Clientes Negligenciados
                  </h4>
                  <p>
                    <strong>18 clientes</strong> não receberam visita há mais de
                    30 dias
                  </p>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        width: "35%",
                        height: "100%",
                        background: "#dc3545",
                      }}
                    ></div>
                  </div>
                </div>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Cliente</th>
                      <th style={styles.th}>Visitas</th>
                      <th style={styles.th}>% do Total</th>
                      <th style={styles.th}>Última Visita</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoData.visitsDistribution.map((item, index) => (
                      <tr key={index}>
                        <td style={styles.td}>{item.client}</td>
                        <td style={styles.td}>{item.visits}</td>
                        <td style={styles.td}>{item.percentage}%</td>
                        <td style={styles.td}>
                          {new Date(item.lastVisit).toLocaleDateString("pt-BR")}
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              color:
                                item.status === "Excesso"
                                  ? "#e76f51"
                                  : "#2a9d8f",
                              fontWeight: 600,
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sugestões */}
              <div style={styles.analysisSection}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                  🎯 Sugestões de Otimização
                </h2>

                <div style={styles.suggestionCard}>
                  <h4 style={{ marginBottom: "0.5rem" }}>
                    🔄 Redistribuir Visitas
                  </h4>
                  <p>
                    Reduzir visitas nos 3 clientes mais visitados e realocar
                    para clientes negligenciados
                  </p>
                  <small style={{ color: "#666" }}>
                    Impacto estimado: +15% de cobertura
                  </small>
                </div>

                <div style={styles.suggestionCard}>
                  <h4 style={{ marginBottom: "0.5rem" }}>🗺️ Otimizar Rotas</h4>
                  <p>
                    Agrupar visitas por região geográfica para aumentar
                    eficiência
                  </p>
                  <small style={{ color: "#666" }}>
                    Impacto estimado: +5 visitas/semana
                  </small>
                </div>

                <div style={styles.suggestionCard}>
                  <h4 style={{ marginBottom: "0.5rem" }}>
                    📅 Planejamento Estratégico
                  </h4>
                  <p>
                    Implementar calendário de visitas obrigatórias para clientes
                    negligenciados
                  </p>
                  <small style={{ color: "#666" }}>
                    Impacto estimado: Cobertura de 80% da base
                  </small>
                </div>

                <button
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  onClick={showOptimizationPlan}
                >
                  📋 Ver Plano Detalhado
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
