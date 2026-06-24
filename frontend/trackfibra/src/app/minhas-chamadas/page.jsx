"use client";

import { useCallback, useState } from "react";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import TabelaChamadas from "@/components/TabelaChamadas";
import { ROLES } from "@/config/menu";
import { useAsync } from "@/hooks/useAsync";
import { listarChamadas } from "@/services/chamadas";
import styles from "./minhas-chamadas.module.css";

const TAMANHO_PAGINA = 10;

// Chips de filtro por status. value vazio = todas.
const CHIPS = [
  { value: "", rotulo: "Todas" },
  { value: "ABERTA", rotulo: "Abertas" },
  { value: "CONCLUIDA", rotulo: "Concluídas" },
  { value: "CANCELADA", rotulo: "Canceladas" },
];

export default function MinhasChamadasPage() {
  const [status, setStatus] = useState("");
  const [pagina, setPagina] = useState(0);

  // O backend escopa automaticamente pelas chamadas do técnico autenticado;
  // aqui só enviamos o filtro de status e a paginação.
  const buscar = useCallback(
    () => listarChamadas({ status, page: pagina, size: TAMANHO_PAGINA }),
    [status, pagina],
  );

  const { dados, erro, carregando, executar: carregar } = useAsync(buscar);

  function aoMudarStatus(valor) {
    setStatus(valor);
    setPagina(0);
  }

  const chamadas = dados?.content ?? [];
  const totalPaginas = dados?.totalPages ?? 0;

  return (
    <RoleRoute requiredRole={ROLES.tecnico}>
      <AppShell>
        <h1 className={styles.titulo}>Minhas Chamadas</h1>

        <div className={styles.chips}>
          {CHIPS.map((chip) => (
            <button
              key={chip.value || "todas"}
              type="button"
              className={`${styles.chip} ${
                status === chip.value ? styles.chipAtivo : ""
              }`}
              onClick={() => aoMudarStatus(chip.value)}
            >
              {chip.rotulo}
            </button>
          ))}
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
            <TabelaChamadas chamadas={chamadas} mostrarFuncionario={false} />

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
