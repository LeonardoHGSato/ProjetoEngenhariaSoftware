import styles from "./Loading.module.css";

export default function Loading({ mensagem, tamanho = "medio" }) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <span className={`${styles.spinner} ${styles[tamanho]}`} aria-hidden="true" />
      {mensagem ? <p className={styles.mensagem}>{mensagem}</p> : null}
      <span className={styles.oculto}>Carregando</span>
    </div>
  );
}
