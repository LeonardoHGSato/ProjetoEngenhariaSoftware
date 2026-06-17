"use client";

import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <h1>Dashboard</h1>
      <p>Bem-vindo{user?.nome ? `, ${user.nome}` : ""}.</p>
    </AppShell>
  );
}
