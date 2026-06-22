"use client";

import { useCallback, useState } from "react";
import { apenasDigitos } from "@/lib/masks";

// Consulta o ViaCEP (serviço externo) e devolve os campos de endereço para
// autopreencher o formulário. Não usa o cliente @/lib/api porque a chamada vai
// para fora da nossa API.
//
// Uso: const { buscarCep, carregando } = useViaCep();
//      const endereco = await buscarCep("01001000");
//      // endereco -> { rua, bairro, cidade, uf } ou null (CEP inválido/não encontrado)
export function useViaCep() {
  const [carregando, setCarregando] = useState(false);

  const buscarCep = useCallback(async (cep) => {
    const digitos = apenasDigitos(cep);
    if (digitos.length !== 8) return null;

    setCarregando(true);
    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${digitos}/json/`,
      );
      if (!resposta.ok) return null;

      const dados = await resposta.json();
      if (dados.erro) return null;

      return {
        rua: dados.logradouro ?? "",
        bairro: dados.bairro ?? "",
        cidade: dados.localidade ?? "",
        uf: dados.uf ?? "",
      };
    } catch {
      // Falha de rede: deixa o usuário preencher o endereço manualmente.
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  return { buscarCep, carregando };
}
