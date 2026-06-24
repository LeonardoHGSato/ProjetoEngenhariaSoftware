"use client";

import { useCallback, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { useAsync } from "@/hooks/useAsync";
import styles from "./HistoricoChamadas.module.css";

const TAMANHO_PAGINA = 10;

// Formata a data/hora (ISO LocalDateTime) no padrão pt-BR; tolera valor ausente.
function formatarDataHora(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// tipoServico é serializado como objeto ({ id, nome, ... }); aceita também
// string crua por segurança.
function rotuloTipo(tipo) {
  if (!tipo) return "—";
  return typeof tipo === "string" ? tipo : (tipo.nome ?? tipo.id ?? "—");
}

// "YYYY-MM-DDTHH:mm" no fuso local, para os inputs datetime-local.
function paraInputLocal(data) {
  const ajustada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
  return ajustada.toISOString().slice(0, 16);
}

// Período padrão: últimos 12 meses até agora. O backend exige inicio e fim,
// então sempre partimos de uma janela preenchida.
function periodoPadrao() {
  const agora = new Date();
  const inicio = new Date(agora);
  inicio.setFullYear(inicio.getFullYear() - 1);
  return { inicio: paraInputLocal(inicio), fim: paraInputLocal(agora) };
}

// Componente reutilizável de histórico de chamadas, usado nas abas de detalhes
// de cliente e de funcionário. Recebe `carregar({ inicio, fim, page, size })`,
// que o pai liga ao endpoint da entidade correspondente.
export default function HistoricoChamadas({ carregar }) {
  const [periodo] = useState(periodoPadrao);
  const [inicio, setInicio] = useState(periodo.inicio);
  const [fim, setFim] = useState(periodo.fim);
  const [pagina, setPagina] = useState(0);

  // O backend exige inicio e fim; se algum estiver vazio (input limpo pelo
  // usuário), não disparamos a busca para evitar um 400.
  const buscar = useCallback(() => {
    if (!inicio || !fim) {
      return Promise.resolve({ content: [], totalPages: 0, first: true, last: true });
    }
    return carregar({ inicio, fim, page: pagina, size: TAMANHO_PAGINA });
  }, [carregar, inicio, fim, pagina]);

  const { dados, erro, carregando, executar: recarregar } = useAsync(buscar);

  function aoMudarInicio(valor) {
    setInicio(valor);
    setPagina(0);
  }

  function aoMudarFim(valor) {
    setFim(valor);
    setPagina(0);
  }

  const chamadas = dados?.content ?? [];
  const totalPaginas = dados?.totalPages ?? 0;

  return (
    <div className={styles.container}>
      <div className={styles.filtros}>
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="historico-inicio">
            De
          </label>
          <input
            id="historico-inicio"
            type="datetime-local"
            className={styles.input}
            value={inicio}
            max={fim}
            onChange={(e) => aoMudarInicio(e.target.value)}
          />
        </div>
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="historico-fim">
            Até
          </label>
          <input
            id="historico-fim"
            type="datetime-local"
            className={styles.input}
            value={fim}
            min={inicio}
            onChange={(e) => aoMudarFim(e.target.value)}
          />
        </div>
      </div>

      {carregando ? (
        <Loading mensagem="Carregando histórico..." />
      ) : erro ? (
        <ErroEstado
          mensagem="Não foi possível carregar o histórico."
          onRetry={recarregar}
        />
      ) : chamadas.length === 0 ? (
        <p className={styles.vazio}>Nenhuma chamada no período selecionado.</p>
      ) : (
        <>
          <div className={styles.tabelaWrapper}>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Relato</th>
                </tr>
              </thead>
              <tbody>
                {chamadas.map((chamada) => (
                  <tr key={chamada.id}>
                    <td>{formatarDataHora(chamada.dataHora)}</td>
                    <td>{rotuloTipo(chamada.tipoServico)}</td>
                    <td>
                      <StatusBadge status={chamada.status} />
                    </td>
                    <td className={styles.relato}>
                      {chamada.status === "CONCLUIDA"
                        ? (chamada.relato ?? "—")
                        : "—"}
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
    </div>
  );
}
