"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import ChamadaForm from "@/components/ChamadaForm";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { criarChamada } from "@/services/chamadas";
import styles from "../chamadas.module.css";

export default function NovaChamadaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(payload) {
    setEnviando(true);
    try {
      await criarChamada(payload);
      toast.success("Chamada aberta.");
      router.push("/chamadas");
    } catch {
      // Erros (409 conflito de horário / carro indisponível, 400, etc.) já são
      // exibidos via toast pelo interceptor de api.
      setEnviando(false);
    }
  }

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Nova chamada</h1>
          <Link href="/chamadas" className={styles.acaoVoltar}>
            Voltar
          </Link>
        </div>

        <ChamadaForm onSubmit={handleSubmit} enviando={enviando} />
      </AppShell>
    </RoleRoute>
  );
}
