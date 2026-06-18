"use client";

import { useCallback, useEffect, useState } from "react";

export function useAsync(funcao, { imediato = true } = {}) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(imediato);

  const executar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await funcao();
      setDados(resultado);
      return resultado;
    } catch (e) {
      setErro(e);
      return undefined;
    } finally {
      setCarregando(false);
    }
  }, [funcao]);

  useEffect(() => {
    if (imediato) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      executar();
    }
  }, [imediato, executar]);

  return { dados, erro, carregando, executar };
}
