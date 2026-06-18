"use client";

import { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import styles from "./AppShell.module.css";

export default function AppShell({ children }) {
  const { user } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  function abrirMenu() {
    setMenuAberto(true);
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <PrivateRoute>
      <div className={styles.shell}>
        <div
          className={`${styles.painel} ${menuAberto ? styles.painelAberto : ""}`}
        >
          <Sidebar onNavegar={fecharMenu} />
        </div>

        {menuAberto && (
          <div className={styles.overlay} onClick={fecharMenu} />
        )}

        <div className={styles.principal}>
          <header className={styles.header}>
            <button
              type="button"
              className={styles.hamburguer}
              onClick={abrirMenu}
              aria-label="Abrir menu"
            >
              ☰
            </button>
            {user?.nome && <span className={styles.usuario}>{user.nome}</span>}
          </header>

          <main className={styles.conteudo}>{children}</main>
        </div>
      </div>
    </PrivateRoute>
  );
}
