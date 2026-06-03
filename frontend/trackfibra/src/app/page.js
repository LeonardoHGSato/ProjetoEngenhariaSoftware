"use client";

import { useRouter } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <PrivateRoute>
      <div className={styles.page}>
        <header className={styles.topo}>
          <span className={styles.marca}>TrackFibra</span>
          <div className={styles.usuario}>
            {user?.nome && <span className={styles.nome}>{user.nome}</span>}
            <button
              type="button"
              className={styles.sair}
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </header>

        <main className={styles.conteudo}>
          <h1>Painel de gestão de chamadas</h1>
          <p>
            Você está autenticado{user?.nome ? `, ${user.nome}` : ""}. As telas
            de funcionários, veículos e chamadas entram aqui.
          </p>
        </main>
      </div>
    </PrivateRoute>
  );
}
