"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import StatusBadge from "@/components/StatusBadge";
import TabelaChamadas from "@/components/TabelaChamadas";
import CardIndicador from "@/components/CardIndicador";
import { ROLES } from "@/config/menu";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { buscarResumo } from "@/services/dashboard";
import styles from "./dashboard.module.css";

// Formata a data/hora (ISO LocalDateTime) no padrão pt-BR; tolera valor ausente.
function formatarDataHora(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// tipoServico pode vir como objeto ({ id, nome }) ou string crua.
function rotuloTipo(tipo) {
  if (!tipo) return "—";
  return typeof tipo === "string" ? tipo : (tipo.nome ?? tipo.id ?? "—");
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { dados, erro, carregando, executar: carregar } = useAsync(buscarResumo);

  const ehTecnico = user?.role === ROLES.tecnico;

  return (
    <AppShell>
      <div className={styles.cabecalho}>
        <h1 className={styles.titulo}>Dashboard</h1>
        {user?.nome && (
          <p className={styles.subtitulo}>Bem-vindo, {user.nome}.</p>
        )}
      </div>

      {carregando ? (
        <Loading mensagem="Carregando indicadores..." />
      ) : erro ? (
        <ErroEstado
          mensagem="Não foi possível carregar o dashboard."
          onRetry={carregar}
        />
      ) : ehTecnico ? (
        <ConteudoTecnico dados={dados} router={router} />
      ) : (
        <ConteudoSupervisor dados={dados} router={router} />
      )}
    </AppShell>
  );
}

function ConteudoSupervisor({ dados, router }) {
  const carros = dados?.carrosPorStatus;
  const ultimasChamadas = dados?.ultimasChamadas ?? [];

  return (
    <>
      <div className={styles.grid}>
        <CardIndicador
          titulo="Chamadas abertas"
          valor={dados?.chamadasAbertas ?? 0}
          icone="📞"
          href="/chamadas"
        />
        <CardIndicador
          titulo="Técnicos ativos"
          valor={dados?.tecnicosAtivos ?? 0}
          icone="🧑‍🔧"
          href="/funcionarios"
        />
        <CardIndicador
          titulo="Carros disponíveis"
          valor={dados?.carrosDisponiveis ?? 0}
          icone="🚐"
          href="/veiculos"
        >
          {carros && (
            <div className={styles.breakdown}>
              <span className={styles.breakdownItem}>
                <StatusBadge status="DISPONIVEL" /> {carros.disponiveis ?? 0}
              </span>
              <span className={styles.breakdownItem}>
                <StatusBadge status="EM_USO" /> {carros.emUso ?? 0}
              </span>
              <span className={styles.breakdownItem}>
                <StatusBadge status="MANUTENCAO" /> {carros.emManutencao ?? 0}
              </span>
            </div>
          )}
        </CardIndicador>
      </div>

      <section className={styles.secao}>
        <div className={styles.secaoCabecalho}>
          <h2 className={styles.secaoTitulo}>Últimas chamadas</h2>
          <Link href="/chamadas" className={styles.verTodas}>
            Ver todas
          </Link>
        </div>

        {ultimasChamadas.length === 0 ? (
          <p className={styles.vazio}>Nenhuma chamada recente.</p>
        ) : (
          <ul className={styles.feed}>
            {ultimasChamadas.map((chamada, indice) => (
              <li
                key={`${chamada.chamadaId}-${indice}`}
                className={styles.feedItem}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/chamadas/${chamada.chamadaId}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/chamadas/${chamada.chamadaId}`);
                  }
                }}
              >
                <div className={styles.feedInfo}>
                  <span className={styles.feedCliente}>
                    {chamada.clienteNome}
                  </span>
                  <span className={styles.feedMeta}>
                    {rotuloTipo(chamada.tipoServico)} · {chamada.funcionarioNome}
                  </span>
                </div>
                <div className={styles.feedDireita}>
                  <StatusBadge status={chamada.status} />
                  <span className={styles.feedData}>
                    {formatarDataHora(chamada.dataHora)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function ConteudoTecnico({ dados, router }) {
  const minhasChamadas = dados?.minhasChamadas ?? [];

  return (
    <>
      <div className={styles.grid}>
        <CardIndicador
          titulo="Minhas chamadas abertas"
          valor={dados?.minhasChamadasAbertas ?? 0}
          icone="📋"
          href="/minhas-chamadas"
        />
      </div>

      <section className={styles.secao}>
        <div className={styles.secaoCabecalho}>
          <h2 className={styles.secaoTitulo}>Chamadas abertas</h2>
          <Link href="/minhas-chamadas" className={styles.verTodas}>
            Ver todas
          </Link>
        </div>

        {minhasChamadas.length === 0 ? (
          <p className={styles.vazio}>Você não tem chamadas abertas.</p>
        ) : (
          <TabelaChamadas
            chamadas={minhasChamadas}
            mostrarFuncionario={false}
            onRowClick={(chamada) => router.push(`/chamadas/${chamada.id}`)}
          />
        )}
      </section>
    </>
  );
}
