"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import ConfirmModal from "@/components/ConfirmModal";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { useDebounce } from "@/hooks/useDebounce";
import { mascaraTelefone } from "@/lib/masks";
import {
  listarFuncionarios,
  desativarFuncionario,
} from "@/services/funcionarios";
import styles from "./funcionarios.module.css";

const TAMANHO_PAGINA = 10;

export default function FuncionariosPage() {
  const { toast } = useToast();

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [pagina, setPagina] = useState(0);

  const buscaComAtraso = useDebounce(busca, 300);

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Funcionário selecionado para desativação (controla o ConfirmModal).
  const [aDesativar, setADesativar] = useState(null);
  const [desativando, setDesativando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      const page = await listarFuncionarios({
        nome: buscaComAtraso,
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
  }, [buscaComAtraso, status, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function aoMudarBusca(valor) {
    setBusca(valor);
    setPagina(0);
  }

  function aoMudarStatus(valor) {
    setStatus(valor);
    setPagina(0);
  }

  async function confirmarDesativacao() {
    setDesativando(true);
    try {
      await desativarFuncionario(aDesativar.id);
      toast.success("Funcionário desativado.");
      setADesativar(null);
      carregar();
    } catch {
      // Erros (inclusive 409) já são exibidos via toast pelo interceptor de api.
      setADesativar(null);
    } finally {
      setDesativando(false);
    }
  }

  const funcionarios = dados?.content ?? [];
  const totalPaginas = dados?.totalPages ?? 0;

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Funcionários</h1>
          <Link href="/funcionarios/novo" className={styles.botaoNovo}>
            Novo funcionário
          </Link>
        </div>

        <div className={styles.filtros}>
          <input
            type="search"
            className={styles.busca}
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => aoMudarBusca(e.target.value)}
          />
          <select
            className={styles.select}
            value={status}
            onChange={(e) => aoMudarStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativos</option>
            <option value="INATIVO">Inativos</option>
          </select>
        </div>

        {carregando ? (
          <Loading mensagem="Carregando funcionários..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar os funcionários."
            onRetry={carregar}
          />
        ) : funcionarios.length === 0 ? (
          <p className={styles.vazio}>Nenhum funcionário encontrado.</p>
        ) : (
          <>
            <div className={styles.tabelaWrapper}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((f) => (
                    <tr key={f.id}>
                      <td>{f.nome}</td>
                      <td>{f.email}</td>
                      <td>{mascaraTelefone(f.numeroTelefone)}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            f.statusFuncionario === "ATIVO"
                              ? styles.ativo
                              : styles.inativo
                          }`}
                        >
                          {f.statusFuncionario === "ATIVO" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className={styles.acoes}>
                        <Link
                          href={`/funcionarios/${f.id}/editar`}
                          className={styles.acaoEditar}
                        >
                          Editar
                        </Link>
                        {f.statusFuncionario === "ATIVO" && (
                          <button
                            type="button"
                            className={styles.acaoDesativar}
                            onClick={() => setADesativar(f)}
                          >
                            Desativar
                          </button>
                        )}
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
          aberto={Boolean(aDesativar)}
          titulo="Desativar funcionário"
          mensagem={
            aDesativar ? `Deseja realmente desativar ${aDesativar.nome}?` : ""
          }
          textoConfirmar="Desativar"
          carregando={desativando}
          onConfirmar={confirmarDesativacao}
          onCancelar={() => setADesativar(null)}
        />
      </AppShell>
    </RoleRoute>
  );
}
