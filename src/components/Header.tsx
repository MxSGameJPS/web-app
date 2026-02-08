"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { logout } = useAuth();

  // Imagem hardcoded do original
  const logoUrl =
    "https://i.ibb.co/4wC9VLb0/Captura-de-tela-2025-10-14-173640.png";

  return (
    <header className="header">
      <div
        className="header-brand"
        style={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        <img
          src={logoUrl}
          alt="Logo"
          style={{ height: "45px", filter: "brightness(0) invert(1)" }}
        />
        <h1
          style={{ fontSize: "1.4rem", fontWeight: 400, letterSpacing: "1px" }}
        >
          GESTÃO DE CARTEIRA
        </h1>
      </div>

      <button
        onClick={logout}
        className="btn btn-danger"
        style={{
          position: "absolute",
          right: "2rem",
          top: "50%",
          transform: "translateY(-50%)",
          width: "auto",
          padding: "0.5rem 1rem",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        🚪 Sair
      </button>
    </header>
  );
}
