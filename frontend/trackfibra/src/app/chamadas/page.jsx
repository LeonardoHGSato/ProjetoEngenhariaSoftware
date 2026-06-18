"use client";

import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import { ROLES } from "@/config/menu";

export default function ChamadasPage() {
  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <h1>Chamadas</h1>
      </AppShell>
    </RoleRoute>
  );
}
