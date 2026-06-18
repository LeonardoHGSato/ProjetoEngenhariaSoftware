"use client";

import { useToast } from "@/context/ToastContext";
import styles from "./Toast.module.css";

const ICONES = {
  success: "✓",
  error: "✕",
  warning: "!",
};

export default function ToastContainer() {
  const { toasts, removerToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container} role="region" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.tipo]}`}>
          <span className={styles.icone} aria-hidden="true">
            {ICONES[toast.tipo]}
          </span>
          <p className={styles.mensagem}>{toast.mensagem}</p>
          <button
            type="button"
            className={styles.fechar}
            onClick={() => removerToast(toast.id)}
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
