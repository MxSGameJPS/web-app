"use client";
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Client } from "@/services/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

const PORTE_COLORS = {
  Grande: "#dc3545",
  Médio: "#ffc107",
  Pequeno: "#17a2b8",
};

export default function Charts({ clients }: { clients: Client[] }) {
  const porteCounts: any = { Grande: 0, Médio: 0, Pequeno: 0 };
  const porteRevenue: any = { Grande: 0, Médio: 0, Pequeno: 0 };

  clients.forEach((client) => {
    const porte = client.porte || "Pequeno";
    porteCounts[porte] = (porteCounts[porte] || 0) + 1;
    porteRevenue[porte] =
      (porteRevenue[porte] || 0) + (client.revenue_ytd || 0);
  });

  const labels = ["Grande", "Médio", "Pequeno"];
  const colors = ["#dc3545", "#ffc107", "#17a2b8"];

  const pieData = {
    labels,
    datasets: [
      {
        data: labels.map((l) => porteCounts[l]),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Faturamento YTD (R$)",
        data: labels.map((l) => porteRevenue[l]),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
          font: {
            size: 13,
            weight: 600,
          },
          padding: 12,
          boxWidth: 12,
          boxHeight: 12,
        },
        align: "center" as const,
        fullSize: true,
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 700,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
      },
    },
    scales: {
      y: {
        ticks: {
          color: "#ffffff",
          font: {
            size: 13,
            weight: 600,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        ticks: {
          color: "#ffffff",
          font: {
            size: 13,
            weight: 600,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  return (
    <div className="chart-grid">
      <div className="glass-card chart-card">
        <h2>Distribuição por Porte</h2>
        <div
          style={{ height: "300px", display: "flex", justifyContent: "center" }}
        >
          <Pie data={pieData} options={options} />
        </div>
      </div>
      <div className="glass-card chart-card">
        <h2>Faturamento por Porte</h2>
        <div
          style={{ height: "300px", display: "flex", justifyContent: "center" }}
        >
          <Bar data={barData} options={options} />
        </div>
      </div>
    </div>
  );
}
