"use client";

import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import { ROLES } from "@/config/menu";

export default function MinhasChamadasPage() {
  return (
    <RoleRoute requiredRole={ROLES.tecnico}>
      <AppShell>
        <h1>Minhas Chamadas</h1>
      </AppShell>
    </RoleRoute>
  );
}
