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
import { mascaraCpfCnpj, mascaraTelefone } from "@/lib/masks";
import { buscarCliente, historicoCliente } from "@/services/clientes";
import styles from "./detalhe.module.css";

// Monta o endereço completo em uma linha legível, ignorando partes vazias.
function formatarEndereco(endereco) {
  if (!endereco) return "—";
  const { rua, numero, complemento, bairro, cidade, uf, cep } = endereco;
  const linha1 = [rua, numero].filter(Boolean).join(", ");
  const partes = [
    [linha1, complemento].filter(Boolean).join(" - "),
    bairro,
    [cidade, uf].filter(Boolean).join("/"),
    cep,
  ].filter(Boolean);
  return partes.join(" • ") || "—";
}

export default function DetalheClientePage() {
  const { id } = useParams();
  const [aba, setAba] = useState("dados");

  const carregarCliente = useCallback(() => buscarCliente(id), [id]);
  const {
    dados: cliente,
    erro,
    carregando,
    executar: recarregar,
  } = useAsync(carregarCliente);

  // Referência estável para o componente de histórico (evita refetch em loop).
  const carregarHistorico = useCallback(
    (params) => historicoCliente(id, params),
    [id],
  );

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>{cliente ? cliente.nome : "Cliente"}</h1>
          <div className={styles.acoesCabecalho}>
            <Link href={`/clientes/${id}/editar`} className={styles.acaoEditar}>
              Editar
            </Link>
            <Link href="/clientes" className={styles.acaoVoltar}>
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
            <Loading mensagem="Carregando cliente..." />
          ) : erro ? (
            <ErroEstado
              mensagem="Não foi possível carregar o cliente."
              onRetry={recarregar}
            />
          ) : !cliente ? null : (
            <div className={styles.grid}>
              <section className={styles.card}>
                <h2 className={styles.cardTitulo}>Contato</h2>
                <dl className={styles.lista}>
                  <div className={styles.item}>
                    <dt>CPF/CNPJ</dt>
                    <dd>{mascaraCpfCnpj(cliente.cpfCnpj)}</dd>
                  </div>
                  <div className={styles.item}>
                    <dt>Telefone</dt>
                    <dd>{mascaraTelefone(cliente.telefone)}</dd>
                  </div>
                  <div className={styles.item}>
                    <dt>E-mail</dt>
                    <dd>{cliente.email ?? "—"}</dd>
                  </div>
                  <div className={styles.item}>
                    <dt>Status</dt>
                    <dd>{cliente.status === "ATIVO" ? "Ativo" : "Inativo"}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitulo}>Endereço</h2>
                <p className={styles.endereco}>
                  {formatarEndereco(cliente.endereco)}
                </p>
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
