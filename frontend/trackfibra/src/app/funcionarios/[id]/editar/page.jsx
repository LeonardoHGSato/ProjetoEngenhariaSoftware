"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import FuncionarioForm from "@/components/FuncionarioForm";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import {
  editarFuncionario,
  listarFuncionarios,
} from "@/services/funcionarios";
import styles from "../../funcionarios.module.css";

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();

  const [funcionario, setFuncionario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Enquanto o backend não expõe GET /api/v1/funcionarios/{id}, buscamos o
  // funcionário na listagem e localizamos pelo id. A listagem não traz o
  // perfilFuncionario, então ele assume o padrão do form (editável).
  // TODO: trocar por uma busca direta quando o endpoint GET /{id} existir.
  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      const page = await listarFuncionarios({ size: 1000 });
      const encontrado = page.content.find((f) => String(f.id) === String(id));
      if (!encontrado) {
        setErro(true);
        return;
      }
      setFuncionario(encontrado);
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    // Carregamento inicial dos dados (fetch on mount); o setState sincrono no inicio de carregar() e intencional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

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
