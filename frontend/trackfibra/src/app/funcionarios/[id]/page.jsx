"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import HistoricoChamadas from "@/components/HistoricoChamadas";
import { ROLES } from "@/config/menu";
import { useAsync } from "@/hooks/useAsync";
import { mascaraTelefone } from "@/lib/masks";
import { historicoFuncionario, listarFuncionarios } from "@/services/funcionarios";
import styles from "./detalhe.module.css";

export default function DetalheFuncionarioPage() {
  const { id } = useParams();
  const [aba, setAba] = useState("dados");

  // Enquanto o backend não expõe GET /api/v1/funcionarios/{id}, buscamos o
  // funcionário na listagem e localizamos pelo id (mesmo contorno da tela de
  // edição). TODO: trocar por busca direta quando o endpoint GET /{id} existir.
  const carregarFuncionario = useCallback(async () => {
    const page = await listarFuncionarios({ size: 1000 });
    const encontrado = page.content.find((f) => String(f.id) === String(id));
    if (!encontrado) throw new Error("Funcionário não encontrado");
    return encontrado;
  }, [id]);

  const {
    dados: funcionario,
    erro,
    carregando,
    executar: recarregar,
  } = useAsync(carregarFuncionario);

  // Referência estável para o componente de histórico (evita refetch em loop).
  const carregarHistorico = useCallback(
    (params) => historicoFuncionario(id, params),
    [id],
  );

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>
            {funcionario ? funcionario.nome : "Funcionário"}
          </h1>
          <div className={styles.acoesCabecalho}>
            <Link
              href={`/funcionarios/${id}/editar`}
              className={styles.acaoEditar}
            >
              Editar
            </Link>
            <Link href="/funcionarios" className={styles.acaoVoltar}>
              Voltar
            </Link>
          </div>
        </div>

        <div className={styles.abas}>
          <button
            type="button"
            className={`${styles.aba} ${aba === "dados" ? styles.abaAtiva : ""}`}
            onClick={() => setAba("dados")}
          >
            Dados
          </button>
          <button
            type="button"
            className={`${styles.aba} ${
              aba === "historico" ? styles.abaAtiva : ""
            }`}
            onClick={() => setAba("historico")}
          >
            Histórico
          </button>
        </div>

        {aba === "dados" ? (
          carregando ? (
            <Loading mensagem="Carregando funcionário..." />
          ) : erro ? (
            <ErroEstado
              mensagem="Não foi possível carregar o funcionário."
              onRetry={recarregar}
            />
          ) : !funcionario ? null : (
            <div className={styles.grid}>
              <section className={styles.card}>
                <h2 className={styles.cardTitulo}>Contato</h2>
                <dl className={styles.lista}>
                  <div className={styles.item}>
                    <dt>E-mail</dt>
                    <dd>{funcionario.email ?? "—"}</dd>
                  </div>
                  <div className={styles.item}>
                    <dt>Telefone</dt>
                    <dd>{mascaraTelefone(funcionario.numeroTelefone)}</dd>
                  </div>
                  <div className={styles.item}>
                    <dt>Status</dt>
                    <dd>
                      {funcionario.statusFuncionario === "ATIVO"
                        ? "Ativo"
                        : "Inativo"}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          )
        ) : (
          <HistoricoChamadas carregar={carregarHistorico} />
        )}
      </AppShell>
    </RoleRoute>
  );
}
