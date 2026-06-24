"use client";

import StatusBadge from "@/components/StatusBadge";
import styles from "./TabelaChamadas.module.css";

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

// Tabela de chamadas reutilizável entre /chamadas (supervisor) e
// /minhas-chamadas (técnico). Componente de apresentação: não busca dados.
// Props:
//  - chamadas: array de ChamadaListagemDTO.
//  - mostrarFuncionario: exibe a coluna "Funcionário" (oculta para o técnico).
//  - onRowClick(chamada): torna a linha clicável (ex: ir aos detalhes).
export default function TabelaChamadas({
  chamadas = [],
  mostrarFuncionario = false,
  onRowClick,
}) {
  const clicavel = typeof onRowClick === "function";

  return (
    <div className={styles.tabelaWrapper}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Tipo</th>
            {mostrarFuncionario && <th>Funcionário</th>}
            <th>Cidade</th>
            <th>Data/Hora</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {chamadas.map((chamada) => (
            <tr
              key={chamada.id}
              className={clicavel ? styles.linhaClicavel : undefined}
              onClick={clicavel ? () => onRowClick(chamada) : undefined}
              tabIndex={clicavel ? 0 : undefined}
              role={clicavel ? "button" : undefined}
              onKeyDown={
                clicavel
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(chamada);
                      }
                    }
                  : undefined
              }
            >
              <td>{chamada.clienteNome}</td>
              <td>{rotuloTipo(chamada.tipoServico)}</td>
              {mostrarFuncionario && <td>{chamada.funcionarioNome}</td>}
              <td>{chamada.cidade ?? "—"}</td>
              <td>{formatarDataHora(chamada.dataHora)}</td>
              <td>
                <StatusBadge status={chamada.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
