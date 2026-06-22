"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import FuncionarioForm from "@/components/FuncionarioForm";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { useAsync } from "@/hooks/useAsync";
import {
  editarFuncionario,
  listarFuncionarios,
} from "@/services/funcionarios";
import styles from "../../funcionarios.module.css";

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();

  const [enviando, setEnviando] = useState(false);

  // Enquanto o backend não expõe GET /api/v1/funcionarios/{id}, buscamos o
  // funcionário na listagem e localizamos pelo id. A listagem não traz o
  // perfilFuncionario, então ele assume o padrão do form (editável).
  // TODO: trocar por uma busca direta quando o endpoint GET /{id} existir.
  const buscarFuncionario = useCallback(async () => {
    const page = await listarFuncionarios({ size: 1000 });
    const encontrado = page.content.find((f) => String(f.id) === String(id));
    if (!encontrado) throw new Error("Funcionário não encontrado");
    return encontrado;
  }, [id]);

  const {
    dados: funcionario,
    erro,
    carregando,
    executar: carregar,
  } = useAsync(buscarFuncionario);

  async function handleSubmit(payload) {
    setEnviando(true);
    try {
      await editarFuncionario(id, payload);
      toast.success("Funcionário atualizado.");
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
          <h1>Editar funcionário</h1>
          <Link href="/funcionarios" className={styles.acaoEditar}>
            Voltar
          </Link>
        </div>

        {carregando ? (
          <Loading mensagem="Carregando funcionário..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar o funcionário."
            onRetry={carregar}
          />
        ) : (
          <FuncionarioForm
            modo="editar"
            valoresIniciais={funcionario}
            onSubmit={handleSubmit}
            enviando={enviando}
          />
        )}
      </AppShell>
    </RoleRoute>
  );
}
