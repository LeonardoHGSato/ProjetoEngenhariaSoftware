// Serviço de acesso à API de chamadas (/api/v1/chamadas).
// O tratamento de erro/token é feito pelos interceptors do cliente em @/lib/api.

import api from "@/lib/api";

const BASE = "/api/v1/chamadas";

// Abre uma chamada. Payload:
// { clienteId, funcionarioId, carroId, tipoServico, dataHora, endereco }.
// Pode retornar 409 (conflito de horário, carro indisponível, funcionário inativo).
export async function criarChamada(payload) {
  const { data } = await api.post(BASE, payload);
  return data;
}
