"use client";

import { useEffect, useState } from "react";

// Retorna uma versão "atrasada" do valor: só atualiza depois que o valor
// para de mudar pelo tempo informado. Usado na busca da listagem (300ms)
// para evitar uma requisição a cada tecla.
export function useDebounce(valor, atraso = 300) {
  const [valorComAtraso, setValorComAtraso] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorComAtraso(valor), atraso);
    return () => clearTimeout(temporizador);
  }, [valor, atraso]);

  return valorComAtraso;
}
