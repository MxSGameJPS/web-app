"use client";
import React from "react";
import { Client } from "@/services/api";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function KPICards({ clients }: { clients: Client[] }) {
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "Ativo").length;
  const totalRevenue = clients.reduce(
    (sum, c) => sum + (c.revenue_ytd || 0),
    0,
  );
  const totalFrequency = clients.reduce(
    (sum, c) => sum + (c.frequency_days || 0),
    0,
  );
  const avgFrequency =
    totalClients > 0 ? (totalFrequency / totalClients).toFixed(0) : 0;

  return (
    <div className="kpi-container">
      <div className="kpi-card glass-card">
        <h3>Total Clientes</h3>
        <p className="kpi-value">{totalClients}</p>
      </div>
      <div
        className="kpi-card glass-card"
        style={{ borderColor: "#2ecc71", borderBottom: "4px solid #2ecc71" }}
      >
        <h3>Ativos</h3>
        <p className="kpi-value" style={{ color: "#2ecc71" }}>
          {activeClients}
        </p>
      </div>
      <div
        className="kpi-card glass-card"
        style={{ borderColor: "#9b59b6", borderBottom: "4px solid #9b59b6" }}
      >
        <h3>Faturamento YTD</h3>
        <p className="kpi-value" style={{ color: "#9b59b6" }}>
          {formatCurrency(totalRevenue)}
        </p>
      </div>
      <div
        className="kpi-card glass-card"
        style={{ borderColor: "#f1c40f", borderBottom: "4px solid #f1c40f" }}
      >
        <h3>Frequência Média</h3>
        <p className="kpi-value" style={{ color: "#f1c40f" }}>
          {avgFrequency} d
        </p>
      </div>
    </div>
  );
}
