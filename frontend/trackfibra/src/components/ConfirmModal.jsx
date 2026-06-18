"use client";

import { useEffect } from "react";
import styles from "./ConfirmModal.module.css";

// Modal de confirmação genérico e reutilizável.
// Props:
//  - aberto: controla a visibilidade
//  - titulo, mensagem: textos exibidos
//  - textoConfirmar, textoCancelar: rótulos dos botões
//  - variante: "perigo" (padrão) ou "padrao" — muda a cor do botão confirmar
//  - carregando: desabilita os botões enquanto a ação roda
//  - onConfirmar, onCancelar: callbacks dos botões
export default function ConfirmModal({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  variante = "perigo",
  carregando = false,
  onConfirmar,
  onCancelar,
}) {
  // Fecha com a tecla Esc (a menos que esteja carregando).
  useEffect(() => {
    if (!aberto) return;
    function aoPressionar(evento) {
      if (evento.key === "Escape" && !carregando) onCancelar?.();
    }
    document.addEventListener("keydown", aoPressionar);
    return () => document.removeEventListener("keydown", aoPressionar);
  }, [aberto, carregando, onCancelar]);

  if (!aberto) return null;

  function aoClicarOverlay() {
    if (!carregando) onCancelar?.();
  }

  return (
    <div className={styles.overlay} onClick={aoClicarOverlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-titulo" className={styles.titulo}>
          {titulo}
        </h2>
        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.botaoCancelar}
            onClick={onCancelar}
            disabled={carregando}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className={`${styles.botaoConfirmar} ${
              variante === "perigo" ? styles.perigo : ""
            }`}
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? "Aguarde..." : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
