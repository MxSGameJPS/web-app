"use client";
import React from "react";

interface SidebarProps {
  filters: {
    search: string;
    porte: string;
    status: string;
  };
  setFilters: (filters: any) => void;
  onAddClient: () => void;
  onOptimizeRoute: () => void;
}

export default function Sidebar({
  filters,
  setFilters,
  onAddClient,
  onOptimizeRoute,
}: SidebarProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({ search: "", porte: "todos", status: "todos" });
  };

  return (
    <aside className="sidebar">
      <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span className="icon">🔍</span> Filtros Avançados
      </h2>

      <div className="filter-group">
        <label>Pesquisa Global</label>
        <input
          type="text"
          name="search"
          placeholder="Cliente, CNPJ..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>Porte da Empresa</label>
        <select name="porte" value={filters.porte} onChange={handleChange}>
          <option value="todos">Todos os Portes</option>
          <option value="Grande">Grande</option>
          <option value="Médio">Médio</option>
          <option value="Pequeno">Pequeno</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Status Comercial</label>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="todos">Todos os Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      <button className="btn btn-secondary" onClick={handleClear}>
        Limpar
      </button>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      <button className="btn btn-primary" onClick={onAddClient}>
        ➕ Novo Cliente
      </button>
      <button className="btn btn-secondary" onClick={onOptimizeRoute}>
        🗺️ Otimizar Rota
      </button>
    </aside>
  );
}
