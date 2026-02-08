import { createClient, SupabaseClient } from "@supabase/supabase-js";

// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("⚠️ Supabase config missing! Check .env.local");
}

// MOCK DATA
const CURITIBA_CENTER = [-25.4284, -49.2733];
const CLIENT_NAMES = [
  "Hospital Santa Clara",
  "Clínica São Lucas",
  "Maternidade Esperança",
  "Laboratório Central",
  "Centro Médico Alfa",
  "Unidade de Saúde Beta",
];
const PORTE = ["Grande", "Médio", "Pequeno"];
const STATUS = ["Ativo", "Inativo"];

export interface Client {
  id: number | string;
  name: string;
  cnpj?: string;
  porte: string;
  status: string;
  revenue_ytd: number;
  frequency_days: number;
  last_service?: string;
  next_contact?: string;
  address?: string;
  email?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    role: string;
  };
  name?: string;
  created_at?: string;
}

class ClientAPIService {
  private supabase: SupabaseClient | null = null;
  private isMock = false;

  constructor() {
    this.initSupabase();
  }

  private initSupabase() {
    try {
      console.log("🔄 Inicializando Supabase...");
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      console.log("✅ Supabase Client criado");
    } catch (error) {
      console.error("❌ Erro ao criar cliente Supabase:", error);
      this.isMock = true;
    }
  }

  // Auth methods
  async getSession() {
    if (!this.supabase)
      return {
        data: { session: null },
        error: { message: "Client not initialized" },
      };
    return await this.supabase.auth.getSession();
  }

  async signInWithPassword({ email, password }: any) {
    // Prioritize Custom Backend API (since users are in public tables, not Supabase Auth)
    // "mockSignIn" logic was actually calling the real Backend API.
    const apiLogin = await this.signInWithApi(email, password);

    // If API login succeeds, return it
    if (!apiLogin.error) {
      return apiLogin;
    }

    // Fallback to Supabase Auth only if API fails and Supabase is available
    if (!this.isMock && this.supabase) {
      try {
        console.log(
          "⚠️ Backend login failed, trying Supabase Auth fallback...",
        );
        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        // Return the original API error if Supabase also fails
        return apiLogin;
      }
    }

    return apiLogin;
  }

  async signOut() {
    if (this.supabase) await this.supabase.auth.signOut();
  }

  // --- GERENCIAMENTO DE USUÁRIOS (VIA API ROUTES) ---

  async getTeam() {
    // Agora usamos API Routes com Postgres, então sempre tentamos buscar do banco
    // Apenas se falhar (catch) ou retornar vazio, poderíamos considerar mock, mas vamos confiar na API.
    try {
      const [managersRes, directorsRes] = await Promise.all([
        fetch("/api/managers"),
        fetch("/api/directors"),
      ]);

      const managers = await managersRes.json();
      const directors = await directorsRes.json();

      // Se a API retornar erro/array vazio, o frontend lida.
      if (!Array.isArray(managers) || !Array.isArray(directors)) return [];

      const m = managers.map((u: any) => ({ ...u, role: "manager" }));
      const d = directors.map((u: any) => ({ ...u, role: "director" }));

      return [...m, ...d];
    } catch (err) {
      console.error("Erro ao buscar equipe:", err);
      return [];
    }
  }

  async createManager(data: any) {
    const endpoint =
      data.role === "director" ? "/api/directors" : "/api/managers";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao criar usuário");
    return await res.json();
  }

  async updateManager(id: string, data: any) {
    const endpoint =
      data.role === "director" ? "/api/directors" : "/api/managers";
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error("Erro ao atualizar usuário");
    return await res.json();
  }

  async deleteManager(id: string, role: string = "manager") {
    // Precisa do role para saber onde deletar
    const endpoint = role === "director" ? "/api/directors" : "/api/managers";
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Erro ao remover usuário");
  }

  // Renamed from mockSignIn to reflect reality (It calls the actual API)
  private async signInWithApi(email: string, password: string) {
    console.log("🔐 Tentando login via API Backend...");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        return { data, error: null };
      } else {
        return {
          data: { user: null, session: null },
          error: { message: data.error || "Login falhou" },
        };
      }
    } catch (err) {
      console.error("Erro no login API:", err);
      // Network error?
      return {
        data: { user: null, session: null },
        error: { message: "Erro de conexão com servidor" },
      };
    }
  }

  // Data methods
  async getClients(
    userId?: string,
    role?: string,
    targetUserId?: string,
  ): Promise<Client[]> {
    if (this.isMock || !this.supabase) return this.getMockClients(targetUserId);

    try {
      let query = this.supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false });

      // Se for Dono ou Diretor e não especificou um alvo, vê tudo (ou lógica customizada)
      // Se especificou targetUserId, filtra por aquele usuário
      if (targetUserId) {
        query = query.eq("user_id", targetUserId);
      } else if (role !== "owner" && role !== "director" && role !== "admin") {
        // Gerentes só veem seus próprios clientes
        if (userId) query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      // ... (restante do código igual)

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        return this.getMockClients();
      }

      return (data as Client[]) || [];
    } catch (error) {
      console.error("Erro crítico ao buscar clientes:", error);
      return this.getMockClients();
    }
  }

  async createClient(client: Partial<Client>) {
    if (this.isMock || !this.supabase) {
      console.log("Mock create client", client);
      return { data: client, error: null };
    }
    return await this.supabase
      .from("clientes")
      .insert(client)
      .select()
      .single();
  }

  async updateClient(id: string | number, updates: Partial<Client>) {
    if (this.isMock || !this.supabase) {
      console.log("Mock update client", id, updates);
      return { data: updates, error: null };
    }
    return await this.supabase
      .from("clientes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
  }

  async deleteClient(id: string | number) {
    if (this.isMock || !this.supabase) {
      console.log("Mock delete client", id);
      return { error: null };
    }
    return await this.supabase.from("clientes").delete().eq("id", id);
  }

  // Geocoding helper
  async geocodeAddress(address: string) {
    if (!address) return null;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=br`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          formattedAddress: data[0].display_name,
        };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  }

  private getMockClients(targetUserId?: string): Client[] {
    console.log("🎲 Gerando dados mock para", targetUserId || "todos");
    const mockClients: Client[] = [];
    const seed = targetUserId ? targetUserId.charCodeAt(0) : 123; // Seed simples baseada no ID

    // Gera mais clientes se for visão geral (sem targetUserId)
    const count = targetUserId ? 8 : 25;

    for (let i = 1; i <= count; i++) {
      const porte = PORTE[(i + seed) % PORTE.length];
      // ... resto da lógica de geração de dados mock (simplificada para brevidade, mantendo a original)
      let revenue, frequency;
      if (porte === "Grande") {
        revenue = 50000 + i * 1000;
        frequency = 7;
      } else if (porte === "Médio") {
        revenue = 15000 + i * 500;
        frequency = 15;
      } else {
        revenue = 1000 + i * 100;
        frequency = 30;
      }

      mockClients.push({
        id: i,
        name: `${CLIENT_NAMES[i % CLIENT_NAMES.length]} ${i} ${targetUserId ? "(Carteira " + targetUserId + ")" : ""}`,
        porte: porte,
        status: STATUS[i % STATUS.length],
        revenue_ytd: revenue,
        frequency_days: frequency,
        last_service: new Date().toISOString().split("T")[0],
        next_contact: new Date().toISOString().split("T")[0],
        address: "Rua Exemplo, 100 - Curitiba/PR",
        lat: CURITIBA_CENTER[0] + (Math.random() - 0.5) * 0.1,
        lng: CURITIBA_CENTER[1] + (Math.random() - 0.5) * 0.1,
        user_id: targetUserId || `mock-user-${(i % 3) + 1}`, // Distribui entre usuarios ficticios se for visão geral
      });
    }
    return mockClients;
  }
}

export const api = new ClientAPIService();
