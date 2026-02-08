"use client";
import React, { useState, useEffect } from "react";
import { Client } from "@/services/api";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Partial<Client>) => Promise<void>;
  client?: Client;
}

export default function ClientModal({
  isOpen,
  onClose,
  onSave,
  client,
}: ClientModalProps) {
  const [formData, setFormData] = useState<Partial<Client>>({});

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({});
    }
  }, [client, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{client ? "✏️ Editar Cliente" : "➕ Adicionar Novo Cliente"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>CNPJ:</label>
            <input
              name="cnpj"
              value={formData.cnpj || ""}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div className="form-group">
            <label>Endereço:</label>
            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Rua, Número - Cidade/UF"
            />
          </div>
          <div className="form-group">
            <label>Porte:</label>
            <select
              name="porte"
              value={formData.porte || "Pequeno"}
              onChange={handleChange}
            >
              <option value="Grande">Grande</option>
              <option value="Médio">Médio</option>
              <option value="Pequeno">Pequeno</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status || "Ativo"}
              onChange={handleChange}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <div className="form-group">
            <label>Faturamento YTD (R$):</label>
            <input
              type="number"
              name="revenue_ytd"
              value={formData.revenue_ytd || 0}
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ width: "auto" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "auto" }}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
