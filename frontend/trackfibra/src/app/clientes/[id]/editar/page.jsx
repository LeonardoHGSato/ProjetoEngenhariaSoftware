"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import ClienteForm from "@/components/ClienteForm";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { useAsync } from "@/hooks/useAsync";
import { buscarCliente, editarCliente } from "@/services/clientes";
import styles from "../../clientes.module.css";

export default function EditarClientePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();

  const [enviando, setEnviando] = useState(false);

  // Busca o cliente completo (com e-mail e endereço) para pré-preencher o
  // formulário, usando GET /api/v1/clientes/{id}.
  const carregarCliente = useCallback(() => buscarCliente(id), [id]);

  const {
    dados: cliente,
    erro,
    carregando,
    executar: carregar,
  } = useAsync(carregarCliente);

  async function handleSubmit(payload) {
    setEnviando(true);
    try {
      await editarCliente(id, payload);
      toast.success("Cliente atualizado.");
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
          <h1>Editar cliente</h1>
          <Link href="/clientes" className={styles.acaoEditar}>
            Voltar
          </Link>
        </div>

        {carregando ? (
          <Loading mensagem="Carregando cliente..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar o cliente."
            onRetry={carregar}
          />
        ) : (
          <ClienteForm
            modo="editar"
            valoresIniciais={cliente}
            onSubmit={handleSubmit}
            enviando={enviando}
          />
        )}
      </AppShell>
    </RoleRoute>
  );
}
