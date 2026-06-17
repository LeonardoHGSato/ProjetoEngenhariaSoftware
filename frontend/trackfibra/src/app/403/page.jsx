import Link from "next/link";
import styles from "../erro.module.css";

export default function AcessoNegadoPage() {
  return (
    <div className={styles.container}>
      <span className={styles.codigo}>403</span>
      <h1 className={styles.titulo}>Acesso negado</h1>
      <p className={styles.mensagem}>
        Você não tem permissão para acessar esta página.
      </p>
      <Link href="/dashboard" className={styles.voltar}>
        Voltar para o início
      </Link>
    </div>
  );
}
