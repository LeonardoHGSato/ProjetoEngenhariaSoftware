"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import VeiculoForm from "@/components/VeiculoForm";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { cadastrarVeiculo } from "@/services/veiculos";
import styles from "../veiculos.module.css";

export default function NovoVeiculoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(payload) {
    setEnviando(true);
    try {
      await cadastrarVeiculo(payload);
      toast.success("Veículo cadastrado.");
      router.push("/veiculos");
    } catch {
      // Erros já são exibidos via toast pelo interceptor de api.
      setEnviando(false);
    }
  }

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Novo veículo</h1>
          <Link href="/veiculos" className={styles.acaoEditar}>
            Voltar
          </Link>
        </div>

        <VeiculoForm modo="criar" onSubmit={handleSubmit} enviando={enviando} />
      </AppShell>
    </RoleRoute>
  );
}
