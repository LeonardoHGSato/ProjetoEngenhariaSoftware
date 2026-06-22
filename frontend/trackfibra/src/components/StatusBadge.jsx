import styles from "./StatusBadge.module.css";

// Mapeia cada status para o rótulo exibido e a classe de cor.
// Hoje cobre os status de veículo (StatusCarro); novos domínios podem
// estender este mapa sem alterar quem usa o componente.
const STATUS = {
  DISPONIVEL: { rotulo: "Disponível", classe: styles.disponivel },
  EM_USO: { rotulo: "Em uso", classe: styles.emUso },
  MANUTENCAO: { rotulo: "Manutenção", classe: styles.manutencao },
  DESATIVADO: { rotulo: "Desativado", classe: styles.desativado },
};

// Badge de status reutilizável. Para um status desconhecido, exibe o valor
// cru com a cor neutra, evitando quebrar a tela.
export default function StatusBadge({ status }) {
  const config = STATUS[status] ?? { rotulo: status, classe: styles.neutro };

  return (
    <span className={`${styles.badge} ${config.classe}`}>{config.rotulo}</span>
  );
}
