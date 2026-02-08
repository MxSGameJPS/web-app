"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, User } from "@/services/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      // Check local storage fallback first (similar to original logic)
      const localToken = localStorage.getItem("auth_token");
      const localEmail = localStorage.getItem("user_email");

      if (localToken && localEmail) {
        setUser({
          id: "local-user",
          email: localEmail,
          user_metadata: { role: localStorage.getItem("user_role") || "user" },
        });
      }

      // Verify with API
      const { data } = await api.getSession();
      if (data?.session?.user) {
        // @ts-ignore
        setUser(data.session.user);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await api.signInWithPassword({ email, password });

    if (error || !data.user) {
      setIsLoading(false);
      throw new Error(error?.message || "Login falhou");
    }

    // @ts-ignore
    setUser(data.user);

    // Save to local storage for persistence (legacy support)
    if (data.session) {
      localStorage.setItem("auth_token", data.session.access_token);
      localStorage.setItem("user_email", data.user.email || "");
      // @ts-ignore
      localStorage.setItem(
        "user_role",
        data.user.user_metadata?.role || "user",
      );
    }

    router.push("/");
    setIsLoading(false);
  };

  const logout = async () => {
    await api.signOut();
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
