"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { listarVeiculos, removerVeiculo } from "@/services/veiculos";
import styles from "./veiculos.module.css";

const TAMANHO_PAGINA = 10;

export default function VeiculosPage() {
  const { toast } = useToast();

  const [status, setStatus] = useState("");
  const [pagina, setPagina] = useState(0);

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Veículo selecionado para remoção (controla o ConfirmModal).
  const [aRemover, setARemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      const page = await listarVeiculos({
        status,
        page: pagina,
        size: TAMANHO_PAGINA,
      });
      setDados(page);
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, [status, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function aoMudarStatus(valor) {
    setStatus(valor);
    setPagina(0);
  }

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await removerVeiculo(aRemover.id);
      toast.success("Veículo removido.");
      setARemover(null);
      carregar();
    } catch {
      // Erros (inclusive 409) já são exibidos via toast pelo interceptor de api.
      setARemover(null);
    } finally {
      setRemovendo(false);
    }
  }

  const veiculos = dados?.content ?? [];
  const totalPaginas = dados?.totalPages ?? 0;

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Veículos</h1>
          <Link href="/veiculos/novo" className={styles.botaoNovo}>
            Novo veículo
          </Link>
        </div>

        <div className={styles.filtros}>
          <select
            className={styles.select}
            value={status}
            onChange={(e) => aoMudarStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="EM_USO">Em uso</option>
            <option value="MANUTENCAO">Manutenção</option>
            <option value="DESATIVADO">Desativado</option>
          </select>
        </div>

        {carregando ? (
          <Loading mensagem="Carregando veículos..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar os veículos."
            onRetry={carregar}
          />
        ) : veiculos.length === 0 ? (
          <p className={styles.vazio}>Nenhum veículo encontrado.</p>
        ) : (
          <>
            <div className={styles.tabelaWrapper}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>Ano</th>
                    <th>Status</th>
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {veiculos.map((v) => (
                    <tr key={v.id}>
                      <td>{v.placa}</td>
                      <td>{v.modelo}</td>
                      <td>{v.marca}</td>
                      <td>{v.ano}</td>
                      <td>
                        <StatusBadge status={v.status} />
                      </td>
                      <td className={styles.acoes}>
                        <Link
                          href={`/veiculos/${v.id}/editar`}
                          className={styles.acaoEditar}
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          className={styles.acaoRemover}
                          onClick={() => setARemover(v)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className={styles.paginacao}>
                <button
                  type="button"
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={dados.first}
                >
                  Anterior
                </button>
                <span>
                  Página {pagina + 1} de {totalPaginas}
                </span>
                <button
                  type="button"
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={dados.last}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}

        <ConfirmModal
          aberto={Boolean(aRemover)}
          titulo="Remover veículo"
          mensagem={
            aRemover
              ? `Deseja realmente remover o veículo de placa ${aRemover.placa}?`
              : ""
          }
          textoConfirmar="Remover"
          carregando={removendo}
          onConfirmar={confirmarRemocao}
          onCancelar={() => setARemover(null)}
        />
      </AppShell>
    </RoleRoute>
  );
}
