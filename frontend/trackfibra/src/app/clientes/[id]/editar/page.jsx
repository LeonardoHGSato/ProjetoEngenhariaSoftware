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
import { editarCliente, listarClientes } from "@/services/clientes";
import styles from "../../clientes.module.css";

export default function EditarClientePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();

  const [enviando, setEnviando] = useState(false);

  // O backend ainda não expõe um GET /api/v1/clientes/{id} utilizável, então
  // buscamos o cliente na listagem e localizamos pelo id. A listagem não traz
  // endereço/e-mail completos, então o formulário começa só com nome, telefone
  // e CPF/CNPJ; os demais campos são preenchidos pelo usuário (CEP via ViaCEP).
  // TODO: trocar por uma busca direta quando o endpoint GET /{id} existir.
  const buscarCliente = useCallback(async () => {
    const page = await listarClientes({ size: 1000 });
    const encontrado = page.content.find((c) => String(c.id) === String(id));
    if (!encontrado) throw new Error("Cliente não encontrado");
    return encontrado;
  }, [id]);

  const {
    dados: cliente,
    erro,
    carregando,
    executar: carregar,
  } = useAsync(buscarCliente);

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
