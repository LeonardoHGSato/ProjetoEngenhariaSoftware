"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import ConfirmModal from "@/components/ConfirmModal";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { mascaraCpfCnpj, mascaraTelefone } from "@/lib/masks";
import { listarClientes, desativarCliente } from "@/services/clientes";
import styles from "./clientes.module.css";

const TAMANHO_PAGINA = 10;

export default function ClientesPage() {
  const { toast } = useToast();

  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);

  const buscaComAtraso = useDebounce(busca, 300);

  // Cliente selecionado para desativação (controla o ConfirmModal).
  const [aDesativar, setADesativar] = useState(null);
  const [desativando, setDesativando] = useState(false);

  // useAsync cuida do carregamento inicial e refaz a busca sempre que os
  // filtros mudam (a função recriada altera executar e dispara o efeito interno).
  const buscarClientes = useCallback(
    () =>
      listarClientes({
        busca: buscaComAtraso,
        page: pagina,
        size: TAMANHO_PAGINA,
      }),
    [buscaComAtraso, pagina],
  );

  const {
    dados,
    erro,
    carregando,
    executar: carregar,
  } = useAsync(buscarClientes);

  function aoMudarBusca(valor) {
    setBusca(valor);
    setPagina(0);
  }

  async function confirmarDesativacao() {
    setDesativando(true);
    try {
      await desativarCliente(aDesativar.id);
      toast.success("Cliente desativado.");
      setADesativar(null);
      carregar();
    } catch {
      // Erros (inclusive 409) já são exibidos via toast pelo interceptor de api.
      setADesativar(null);
    } finally {
      setDesativando(false);
    }
  }

  const clientes = dados?.content ?? [];
  const totalPaginas = dados?.totalPages ?? 0;

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Clientes</h1>
          <Link href="/clientes/novo" className={styles.botaoNovo}>
            Novo cliente
          </Link>
        </div>

        <div className={styles.filtros}>
          <input
            type="search"
            className={styles.busca}
            placeholder="Buscar por nome ou CPF/CNPJ..."
            value={busca}
            onChange={(e) => aoMudarBusca(e.target.value)}
          />
        </div>

        {carregando ? (
          <Loading mensagem="Carregando clientes..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar os clientes."
            onRetry={carregar}
          />
        ) : clientes.length === 0 ? (
          <p className={styles.vazio}>Nenhum cliente encontrado.</p>
        ) : (
          <>
            <div className={styles.tabelaWrapper}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF/CNPJ</th>
                    <th>Telefone</th>
                    <th>Cidade</th>
                    <th>Status</th>
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nome}</td>
                      <td>{mascaraCpfCnpj(c.cpfCnpj)}</td>
                      <td>{mascaraTelefone(c.telefone)}</td>
                      <td>{c.cidade}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            c.status === "ATIVO" ? styles.ativo : styles.inativo
                          }`}
                        >
                          {c.status === "ATIVO" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className={styles.acoes}>
                        <Link
                          href={`/clientes/${c.id}`}
                          className={styles.acaoEditar}
                        >
                          Detalhes
                        </Link>
                        <Link
                          href={`/clientes/${c.id}/editar`}
                          className={styles.acaoEditar}
                        >
                          Editar
                        </Link>
                        {c.status === "ATIVO" && (
                          <button
                            type="button"
                            className={styles.acaoDesativar}
                            onClick={() => setADesativar(c)}
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
          titulo="Desativar cliente"
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
