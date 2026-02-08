"use client";
import React from "react";
import { Client } from "@/services/api";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string | number) => void;
  onLocate: (client: Client) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
const formatDate = (dateStr?: string) =>
  dateStr ? new Date(dateStr).toLocaleDateString("pt-BR") : "N/A";

export default function ClientTable({
  clients,
  onEdit,
  onDelete,
  onLocate,
}: ClientTableProps) {
  return (
    <div className="client-list-section glass-card">
      <h2>📋 Listagem Detalhada</h2>
      <div style={{ overflowX: "auto" }}>
        <table id="client-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Porte</th>
              <th>Status</th>
              <th>Faturamento</th>
              <th>Último Serviço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.porte}</td>
                  <td>
                    <span
                      className={
                        client.status === "Ativo"
                          ? "status-ativo"
                          : "status-inativo"
                      }
                    >
                      {client.status}
                    </span>
                  </td>
                  <td>{formatCurrency(client.revenue_ytd)}</td>
                  <td>{formatDate(client.last_service)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button className="btn-edit" onClick={() => onEdit(client)}>
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-edit"
                      style={{ background: "#17a2b8", color: "white" }}
                      onClick={() => onLocate(client)}
                    >
                      🗺️ Localizar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(client.id)}
                    >
                      🗑️ Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
