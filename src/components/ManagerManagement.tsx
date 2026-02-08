"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

interface ManagerManagementProps {
  onBack?: () => void;
}

export default function ManagerManagement({ onBack }: ManagerManagementProps) {
  const [team, setTeam] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTeam();
      setTeam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (user: any = null) => {
    setError("");
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: "manager" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingUser) {
        await api.updateManager(editingUser.id, formData);
      } else {
        if (!formData.password) {
          setError("Senha é obrigatória para novos usuários");
          return;
        }
        await api.createManager(formData);
      }
      setIsModalOpen(false);
      loadTeam();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Tem certeza que deseja excluir este membro da equipe? O login dele deixará de funcionar.",
      )
    ) {
      await api.deleteManager(id);
      loadTeam();
    }
  };

  // Estilos inline para simplificar a integração rápida
  const styles = {
    container: {
      padding: "20px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    table: { width: "100%", borderCollapse: "collapse" as const },
    th: {
      textAlign: "left" as const,
      padding: "12px",
      borderBottom: "2px solid #eee",
      color: "#666",
    },
    td: { padding: "12px", borderBottom: "1px solid #eee" },
    btnAction: {
      marginRight: "10px",
      padding: "5px 10px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
    },
    modalOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "white",
      padding: "30px",
      borderRadius: "10px",
      width: "400px",
      maxWidth: "90%",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "4px",
      border: "1px solid #ddd",
    },
    label: { display: "block", marginBottom: "5px", fontWeight: 500 },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ fontSize: "1.5rem", color: "#2D4471" }}>
          👥 Gestão de Equipe
        </h2>
        <button
          onClick={() => handleOpenModal()}
          style={{
            background: "#2a9d8f",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Novo Membro
        </button>
      </div>

      {isLoading ? (
        <p>Carregando equipe...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Cargo</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {team.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>
                    <strong>{user.name}</strong>
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        background:
                          user.role === "admin" ? "#e9ecef" : "#d4edda",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        color: user.role === "admin" ? "#495057" : "#155724",
                      }}
                    >
                      {user.role === "manager"
                        ? "Gerente"
                        : user.role === "admin"
                          ? "Admin"
                          : user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleOpenModal(user)}
                      style={{
                        ...styles.btnAction,
                        background: "#ffc107",
                        color: "#000",
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        ...styles.btnAction,
                        background: "#dc3545",
                        color: "#fff",
                      }}
                    >
                      🗑️ Remover
                    </button>
                  </td>
                </tr>
              ))}
              {team.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#888",
                    }}
                  >
                    Nenhum gerente cadastrado. Clique em "+ Novo Membro" para
                    começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Edição/Criação */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: "20px", color: "#2D4471" }}>
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </h3>

            {error && (
              <p
                style={{
                  color: "red",
                  marginBottom: "15px",
                  fontSize: "0.9rem",
                }}
              >
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label style={styles.label}>Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={styles.label}>Email (Login)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={styles.label}>
                  {editingUser
                    ? "Nova Senha (deixe em branco para manter)"
                    : "Senha"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  style={styles.input}
                  placeholder={editingUser ? "••••••••" : ""}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={styles.label}>Cargo</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  style={styles.input}
                >
                  <option value="manager">Gerente</option>
                  <option value="director">Diretor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    background: "#ccc",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    background: "#2D4471",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
