import Link from "next/link";
import styles from "./erro.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <span className={styles.codigo}>404</span>
      <h1 className={styles.titulo}>Página não encontrada</h1>
      <p className={styles.mensagem}>
        A página que você procura não existe ou foi movida.
      </p>
      <Link href="/dashboard" className={styles.voltar}>
        Voltar para o início
      </Link>
    </div>
  );
}
