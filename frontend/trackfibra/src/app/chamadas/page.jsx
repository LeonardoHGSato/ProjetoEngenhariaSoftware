"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import TabelaChamadas from "@/components/TabelaChamadas";
import SelectAssincrono from "@/components/SelectAssincrono";
import { ROLES } from "@/config/menu";
import { useAsync } from "@/hooks/useAsync";
import { listarChamadas } from "@/services/chamadas";
import { listarTiposServico } from "@/services/tiposServico";
import { listarFuncionarios } from "@/services/funcionarios";
import styles from "./chamadas.module.css";

const TAMANHO_PAGINA = 20;

const STATUS_OPCOES = [
  { value: "ABERTA", rotulo: "Aberta" },
  { value: "CONCLUIDA", rotulo: "Concluída" },
  { value: "CANCELADA", rotulo: "Cancelada" },
];

export default function ChamadasPage() {
  const router = useRouter();
  const [filtros, setFiltros] = useState({
    status: "",
    tipoServico: "",
    funcionarioId: "",
    inicio: "",
    fim: "",
  });
  const [pagina, setPagina] = useState(0);

  const buscar = useCallback(
    () =>
      listarChamadas({
        status: filtros.status,
        tipoServico: filtros.tipoServico,
        funcionarioId: filtros.funcionarioId,
        inicio: filtros.inicio,
        fim: filtros.fim,
        page: pagina,
        size: TAMANHO_PAGINA,
      }),
    [filtros, pagina],
  );

  const { dados, erro, carregando, executar: carregar } = useAsync(buscar);

  // Carrega a lista de funcionários para o select de filtro (referência estável).
  const carregarFuncionarios = useCallback(
    () => listarFuncionarios({ size: 100 }),
    [],
  );

  function aoMudarFiltro(campo, valor) {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));
    setPagina(0);
  }

  const chamadas = dados?.content ?? [];
  const totalPaginas = dados?.totalPages ?? 0;

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Chamadas</h1>
          <Link href="/chamadas/nova" className={styles.botaoNovo}>
            Nova chamada
          </Link>
        </div>

        <div className={styles.filtros}>
          <div className={styles.campo}>
            <label className={styles.label} htmlFor="filtro-status">
              Status
            </label>
            <select
              id="filtro-status"
              className={styles.select}
              value={filtros.status}
              onChange={(e) => aoMudarFiltro("status", e.target.value)}
            >
              <option value="">Todos</option>
              {STATUS_OPCOES.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.rotulo}
                </option>
              ))}
            </select>
          </div>

          <SelectAssincrono
            id="filtro-tipo"
            label="Tipo de serviço"
            carregar={listarTiposServico}
            getValue={(item) => item.id}
            getLabel={(item) => item.nome}
            placeholder="Todos"
            value={filtros.tipoServico}
            onChange={(valor) => aoMudarFiltro("tipoServico", valor)}
          />

          <SelectAssincrono
            id="filtro-funcionario"
            label="Funcionário"
            carregar={carregarFuncionarios}
            extrairItens={(d) => d?.content ?? []}
            getValue={(item) => item.id}
            getLabel={(item) => item.nome}
            placeholder="Todos"
            value={filtros.funcionarioId}
            onChange={(valor) => aoMudarFiltro("funcionarioId", valor)}
          />

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="filtro-inicio">
              De
            </label>
            <input
              id="filtro-inicio"
              type="datetime-local"
              className={styles.select}
              value={filtros.inicio}
              onChange={(e) => aoMudarFiltro("inicio", e.target.value)}
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="filtro-fim">
              Até
            </label>
            <input
              id="filtro-fim"
              type="datetime-local"
              className={styles.select}
              value={filtros.fim}
              onChange={(e) => aoMudarFiltro("fim", e.target.value)}
            />
          </div>
        </div>

        {carregando ? (
          <Loading mensagem="Carregando chamadas..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar as chamadas."
            onRetry={carregar}
          />
        ) : chamadas.length === 0 ? (
          <p className={styles.vazio}>Nenhuma chamada encontrada.</p>
        ) : (
          <>
            <TabelaChamadas
              chamadas={chamadas}
              mostrarFuncionario
              onRowClick={(chamada) => router.push(`/chamadas/${chamada.id}`)}
            />

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
      </AppShell>
    </RoleRoute>
  );
}
