"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import FuncionarioForm from "@/components/FuncionarioForm";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { cadastrarFuncionario } from "@/services/funcionarios";
import styles from "../funcionarios.module.css";

export default function NovoFuncionarioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(payload) {
    setEnviando(true);
    try {
      await cadastrarFuncionario(payload);
      toast.success("Funcionário cadastrado.");
      router.push("/funcionarios");
    } catch {
      // Erros já são exibidos via toast pelo interceptor de api.
      setEnviando(false);
    }
  }

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Novo funcionário</h1>
          <Link href="/funcionarios" className={styles.acaoEditar}>
            Voltar
          </Link>
        </div>

        <FuncionarioForm
          modo="criar"
          onSubmit={handleSubmit}
          enviando={enviando}
        />
      </AppShell>
    </RoleRoute>
  );
}
