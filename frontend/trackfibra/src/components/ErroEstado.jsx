import styles from "./ErroEstado.module.css";

export default function ErroEstado({
  mensagem = "Não foi possível carregar os dados.",
  onRetry,
}) {
  return (
    <div className={styles.container} role="alert">
      <span className={styles.icone} aria-hidden="true">
        !
      </span>
      <p className={styles.mensagem}>{mensagem}</p>
      {onRetry ? (
        <button type="button" className={styles.botao} onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
