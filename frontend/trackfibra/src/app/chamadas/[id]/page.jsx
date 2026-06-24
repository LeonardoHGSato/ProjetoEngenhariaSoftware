"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PrivateRoute from "@/components/PrivateRoute";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ROLES } from "@/config/menu";
import { useAsync } from "@/hooks/useAsync";
import {
  buscarChamada,
  cancelarChamada,
  finalizarChamada,
} from "@/services/chamadas";
import styles from "./detalhe.module.css";

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

// Mínimo de caracteres exigido no relato ao finalizar (alinhado ao backend).
const RELATO_MIN = 10;

// "YYYY-MM-DDTHH:mm" no fuso local, para pré-preencher o input datetime-local.
function agoraLocal() {
  const agora = new Date();
  const ajustada = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
  return ajustada.toISOString().slice(0, 16);
}

export default function DetalheChamadaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { id } = useParams();

  // O técnico acessa esta página via "Minhas Chamadas" e não tem permissão
  // para a listagem de supervisor (/chamadas), que redireciona ao /403.
  const rotaVoltar =
    user?.role === ROLES.tecnico ? "/minhas-chamadas" : "/chamadas";

  const carregarChamada = useCallback(() => buscarChamada(id), [id]);
  const {
    dados: chamada,
    erro,
    carregando,
    executar: recarregar,
  } = useAsync(carregarChamada);

  // Controla qual modal de ação está aberto: "finalizar", "cancelar" ou null.
  const [acao, setAcao] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [relato, setRelato] = useState("");
  const [dataHoraConclusao, setDataHoraConclusao] = useState(agoraLocal);
  const [motivo, setMotivo] = useState("");

  function abrirFinalizar() {
    setRelato("");
    setDataHoraConclusao(agoraLocal());
    setAcao("finalizar");
  }

  function abrirCancelar() {
    setMotivo("");
    setAcao("cancelar");
  }

  function fecharModal() {
    if (!enviando) setAcao(null);
  }

  async function confirmarFinalizar(evento) {
    evento.preventDefault();
    setEnviando(true);
    try {
      await finalizarChamada(id, { relato, dataHoraConclusao });
      toast.success("Chamada finalizada.");
      setAcao(null);
      await recarregar();
    } catch {
      // Erros (inclusive 409) já são exibidos via toast pelo interceptor de api.
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarCancelar(evento) {
    evento.preventDefault();
    setEnviando(true);
    try {
      await cancelarChamada(id, { motivoCancelamento: motivo });
      toast.success("Chamada cancelada.");
      setAcao(null);
      await recarregar();
    } catch {
      // Erros (inclusive 409) já são exibidos via toast pelo interceptor de api.
    } finally {
      setEnviando(false);
    }
  }

  const aberta = chamada?.status === "ABERTA";
  const relatoValido = relato.trim().length >= RELATO_MIN;

  return (
    <PrivateRoute>
      <AppShell>
        <div className={styles.cabecalho}>
          <div className={styles.tituloGrupo}>
            <h1 className={styles.titulo}>
              Chamada {chamada ? `#${chamada.id}` : ""}
            </h1>
            {chamada && <StatusBadge status={chamada.status} />}
          </div>
          <Link href={rotaVoltar} className={styles.acaoVoltar}>
            Voltar
          </Link>
        </div>

        {carregando ? (
          <Loading mensagem="Carregando chamada..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar a chamada."
            onRetry={recarregar}
          />
        ) : !chamada ? null : (
          <>
            {aberta && (
              <div className={styles.acoes}>
                <button
                  type="button"
                  className={styles.botaoFinalizar}
                  onClick={abrirFinalizar}
                >
                  Finalizar
                </button>
                <button
                  type="button"
                  className={styles.botaoCancelar}
                  onClick={abrirCancelar}
                >
                  Cancelar
                </button>
              </div>
            )}

            <div className={styles.grid}>
              <section className={styles.card}>
                <h2 className={styles.cardTitulo}>Atendimento</h2>
                <dl className={styles.lista}>
                  <div className={styles.item}>
                    <dt>Tipo de serviço</dt>
                    <dd>{rotuloTipo(chamada.tipoServico)}</dd>
                  </div>
                  <div className={styles.item}>
                    <dt>Agendada para</dt>
                    <dd>{formatarDataHora(chamada.dataHora)}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitulo}>Cliente</h2>
                <dl className={styles.lista}>
                  <div className={styles.item}>
                    <dt>Nome</dt>
                    <dd>{chamada.clienteNome ?? "—"}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitulo}>Responsável</h2>
                <dl className={styles.lista}>
                  <div className={styles.item}>
                    <dt>Funcionário</dt>
                    <dd>{chamada.funcionarioNome ?? "—"}</dd>
                  </div>
                  <div className={styles.item}>
                    <dt>Veículo</dt>
                    <dd>{chamada.carroPlaca ?? "—"}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitulo}>Endereço</h2>
                <p className={styles.endereco}>
                  {formatarEndereco(chamada.endereco)}
                </p>
              </section>

              {chamada.relato && (
                <section className={`${styles.card} ${styles.cardLargo}`}>
                  <h2 className={styles.cardTitulo}>Relato do atendimento</h2>
                  <p className={styles.texto}>{chamada.relato}</p>
                </section>
              )}

              {chamada.motivoCancelamento && (
                <section className={`${styles.card} ${styles.cardLargo}`}>
                  <h2 className={styles.cardTitulo}>Motivo do cancelamento</h2>
                  <p className={styles.texto}>{chamada.motivoCancelamento}</p>
                </section>
              )}
            </div>

            <section className={styles.card}>
              <h2 className={styles.cardTitulo}>Linha do tempo</h2>
              <ol className={styles.timeline}>
                <li className={styles.evento}>
                  <span className={`${styles.marcador} ${styles.marcadorAberta}`} />
                  <div className={styles.eventoConteudo}>
                    <strong>Chamada aberta</strong>
                    <span className={styles.eventoData}>
                      {formatarDataHora(chamada.dataHora)}
                    </span>
                  </div>
                </li>
                {chamada.status === "CONCLUIDA" && (
                  <li className={styles.evento}>
                    <span
                      className={`${styles.marcador} ${styles.marcadorConcluida}`}
                    />
                    <div className={styles.eventoConteudo}>
                      <strong>Chamada concluída</strong>
                    </div>
                  </li>
                )}
                {chamada.status === "CANCELADA" && (
                  <li className={styles.evento}>
                    <span
                      className={`${styles.marcador} ${styles.marcadorCancelada}`}
                    />
                    <div className={styles.eventoConteudo}>
                      <strong>Chamada cancelada</strong>
                    </div>
                  </li>
                )}
              </ol>
            </section>
          </>
        )}

        {acao === "finalizar" && (
          <div className={styles.overlay} onClick={fecharModal}>
            <form
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              onSubmit={confirmarFinalizar}
            >
              <h2 className={styles.modalTitulo}>Finalizar chamada</h2>
              <label className={styles.campo}>
                <span className={styles.label}>Data/hora da conclusão</span>
                <input
                  type="datetime-local"
                  className={styles.input}
                  value={dataHoraConclusao}
                  onChange={(e) => setDataHoraConclusao(e.target.value)}
                  required
                />
              </label>
              <label className={styles.campo}>
                <span className={styles.label}>Relato do atendimento</span>
                <textarea
                  className={styles.textarea}
                  value={relato}
                  onChange={(e) => setRelato(e.target.value)}
                  minLength={RELATO_MIN}
                  rows={4}
                  placeholder="Descreva o que foi feito (mínimo 10 caracteres)."
                  required
                />
                <span
                  className={`${styles.contador} ${
                    relatoValido ? "" : styles.contadorInvalido
                  }`}
                >
                  {relato.trim().length}/{RELATO_MIN} caracteres
                </span>
              </label>
              <div className={styles.modalAcoes}>
                <button
                  type="button"
                  className={styles.botaoSecundario}
                  onClick={fecharModal}
                  disabled={enviando}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={styles.botaoFinalizar}
                  disabled={enviando || !relatoValido}
                >
                  {enviando ? "Aguarde..." : "Finalizar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {acao === "cancelar" && (
          <div className={styles.overlay} onClick={fecharModal}>
            <form
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              onSubmit={confirmarCancelar}
            >
              <h2 className={styles.modalTitulo}>Cancelar chamada</h2>
              <label className={styles.campo}>
                <span className={styles.label}>Motivo do cancelamento</span>
                <textarea
                  className={styles.textarea}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={4}
                  placeholder="Informe o motivo do cancelamento."
                  required
                />
              </label>
              <div className={styles.modalAcoes}>
                <button
                  type="button"
                  className={styles.botaoSecundario}
                  onClick={fecharModal}
                  disabled={enviando}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={styles.botaoCancelarConfirmar}
                  disabled={enviando}
                >
                  {enviando ? "Aguarde..." : "Cancelar chamada"}
                </button>
              </div>
            </form>
          </div>
        )}
      </AppShell>
    </PrivateRoute>
  );
}
