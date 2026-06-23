"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import { ROLES } from "@/config/menu";
import styles from "./chamadas.module.css";

export default function ChamadasPage() {
  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Chamadas</h1>
          <Link href="/chamadas/nova" className={styles.botaoNovo}>
            Nova chamada
          </Link>
        </div>
      </AppShell>
    </RoleRoute>
  );
}
