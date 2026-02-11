"use client";
import React, { useEffect, useState } from "react";
import { api, Client, User } from "@/services/api";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import KPICards from "@/components/KPICards";
import ClientTable from "@/components/ClientTable";
import Charts from "@/components/Charts";
import dynamic from "next/dynamic";
import ClientModal from "@/components/ClientModal";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
const Calendar = dynamic(() => import("@/components/Calendar"), { ssr: false });

export default function ManagerDashboard({
  user,
  targetUser,
}: {
  user: User;
  targetUser?: User;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    porte: "todos",
    status: "todos",
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -25.4284, -49.2733,
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(
    undefined,
  );

  const applyFilters = () => {
    let result = [...clients];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          (c.cnpj && c.cnpj.includes(term)),
      );
    }

    if (filters.porte !== "todos") {
      result = result.filter((c) => c.porte === filters.porte);
    }

    if (filters.status !== "todos") {
      result = result.filter((c) => c.status === filters.status);
    }

    setFilteredClients(result);
  };

  const loadClients = async () => {
    // Se targetUser existir, carrega os dados dele. Senão, carrega do próprio usuário logado.
    const targetId = targetUser ? targetUser.id : user.id;
    console.log("Carregando clientes para:", targetId);
    // @ts-ignore
    const data = await api.getClients(
      user.id,
      user.user_metadata.role,
      targetId,
    );
    setClients(data);
    setFilteredClients(data);
  };

  useEffect(() => {
    loadClients();
  }, [user, targetUser]);

  useEffect(() => {
    applyFilters();
  }, [filters, clients]);

  const handleLocateClient = (client: Client) => {
    if (client.lat && client.lng) {
      setMapCenter([client.lat, client.lng]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Cliente sem coordenadas");
    }
  };

  const handleDeleteClient = async (id: string | number) => {
    if (confirm("Tem certeza?")) {
      await api.deleteClient(id);
      loadClients();
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleAddClient = () => {
    setEditingClient(undefined);
    setIsModalOpen(true);
  };

  const handleSaveClient = async (clientData: Partial<Client>) => {
    if (editingClient && editingClient.id) {
      await api.updateClient(editingClient.id, clientData);
    } else {
      await api.createClient(clientData);
    }
    await loadClients();
    setIsModalOpen(false);
  };

  const events = filteredClients.map((c) => ({
    id: String(c.id),
    title: `${c.name} (${c.porte})`,
    start: c.next_contact || new Date().toISOString().split("T")[0],
    className: c.porte?.toLowerCase() || "pequeno",
  }));

  // Modo Supervisão (quando renderizado dentro de outro dashboard)
  const isSupervisionMode = !!targetUser;

  if (isSupervisionMode) {
    return (
      <div style={{ padding: "1rem", background: "#f8f9fa" }}>
        <KPICards clients={filteredClients} />

        <Charts clients={filteredClients} />

        <Calendar events={events} />

        {typeof window !== "undefined" && (
          <Map clients={filteredClients} center={mapCenter} />
        )}

        <ClientTable
          clients={filteredClients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onLocate={handleLocateClient}
        />

        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveClient}
          client={editingClient}
        />
      </div>
    );
  }

  // Modo Normal (dashboard completo)
  return (
    <div style={{ minHeight: "100vh", background: "var(--background-color)" }}>
      <Header />
      <div className="dashboard-grid">
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          onAddClient={handleAddClient}
          onOptimizeRoute={() => alert("Otimizar rota...")}
        />

        <main className="content">
          <KPICards clients={filteredClients} />

          <Charts clients={filteredClients} />

          <Calendar events={events} />

          {typeof window !== "undefined" && (
            <Map clients={filteredClients} center={mapCenter} />
          )}

          <ClientTable
            clients={filteredClients}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onLocate={handleLocateClient}
          />

          <ClientModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveClient}
            client={editingClient}
          />
        </main>
      </div>
    </div>
  );
}
