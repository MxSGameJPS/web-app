"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./login.module.css";

const logoUrl =
  "https://i.ibb.co/MdtYrsZ/Captura-de-tela-2025-10-14-173640-removebg-preview.png";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login falhou");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        background:
          "url(https://i.ibb.co/pjVK1YrY/Design-sem-nome-22.jpg) center center/cover no-repeat fixed",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.15)",
          zIndex: 0,
        }}
      ></div>

      <div
        className="login-card"
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(15px)",
          padding: "35px 30px",
          borderRadius: "25px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
        }}
      >
        <header className="login-header" style={{ marginBottom: "20px" }}>
          <img
            src={logoUrl}
            alt="Curitiba Esterilização"
            style={{ maxWidth: "160px", height: "auto", marginBottom: "15px" }}
          />
          <h1
            style={{
              color: "#2D4471",
              fontSize: "18px",
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: "5px",
            }}
          >
            Gestão de Dashboard
          </h1>
          <p style={{ color: "#666", fontSize: "12px", fontWeight: 600 }}>
            Acesse com suas credenciais
          </p>
        </header>

        {error && (
          <div
            className="error-message"
            style={{
              background: "rgba(244, 67, 54, 0.1)",
              color: "#d32f2f",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "15px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className="form-group"
            style={{ marginBottom: "18px", textAlign: "left" }}
          >
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#2D4471",
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: "100%",
                padding: "12px 18px",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "30px",
              }}
            />
          </div>

          <div
            className="form-group"
            style={{ marginBottom: "18px", textAlign: "left" }}
          >
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#2D4471",
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px 18px",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "30px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#2D4471",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Autenticando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
