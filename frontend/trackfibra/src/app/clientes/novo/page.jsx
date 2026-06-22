"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import ClienteForm from "@/components/ClienteForm";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { cadastrarCliente } from "@/services/clientes";
import styles from "../clientes.module.css";

export default function NovoClientePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(payload) {
    setEnviando(true);
    try {
      await cadastrarCliente(payload);
      toast.success("Cliente cadastrado.");
      router.push("/clientes");
    } catch {
      // Erros (inclusive 409) já são exibidos via toast pelo interceptor de api.
      setEnviando(false);
    }
  }

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Novo cliente</h1>
          <Link href="/clientes" className={styles.acaoEditar}>
            Voltar
          </Link>
        </div>

        <ClienteForm modo="criar" onSubmit={handleSubmit} enviando={enviando} />
      </AppShell>
    </RoleRoute>
  );
}
