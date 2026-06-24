import Link from "next/link";
import styles from "./CardIndicador.module.css";

// Card de indicador reutilizável do dashboard: ícone opcional, título, número
// em destaque e, quando há href, vira um atalho clicável para a listagem
// correspondente. children permite anexar conteúdo extra (ex: breakdown).
export default function CardIndicador({ titulo, valor, icone, href, children }) {
  const conteudo = (
    <>
      <div className={styles.topo}>
        {icone ? (
          <span className={styles.icone} aria-hidden="true">
            {icone}
          </span>
        ) : null}
        <span className={styles.titulo}>{titulo}</span>
      </div>
      <span className={styles.valor}>{valor}</span>
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${styles.card} ${styles.clicavel}`}>
        {conteudo}
      </Link>
    );
  }

  return <div className={styles.card}>{conteudo}</div>;
}
