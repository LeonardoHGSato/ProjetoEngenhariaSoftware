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

// Lista paginada de chamadas com filtros opcionais combinados.
// O backend escopa automaticamente por perfil: quando o usuário é técnico,
// retorna apenas as próprias chamadas e ignora o filtro funcionarioId.
// inicio/fim devem estar no formato ISO LocalDateTime (ex: "2026-06-23T00:00").
// Retorna o objeto Page do Spring: { content, totalPages, number, first, last, ... }.
export async function listarChamadas({
  status,
  tipoServico,
  funcionarioId,
  inicio,
  fim,
  page = 0,
  size = 10,
} = {}) {
  const params = { page, size };
  if (status) params.status = status;
  if (tipoServico) params.tipoServico = tipoServico;
  if (funcionarioId) params.funcionarioId = funcionarioId;
  if (inicio) params.inicio = inicio;
  if (fim) params.fim = fim;

  const { data } = await api.get(BASE, { params });
  return data;
}

// Busca uma chamada pelo id. Retorna o ChamadaResponseDTO completo
// (cliente, funcionário, carro, endereço, relato e motivo de cancelamento),
// usado na tela de detalhes. O backend valida o escopo por perfil.
export async function buscarChamada(id) {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
}

// Finaliza uma chamada aberta. Payload: { relato, dataHoraConclusao }.
// relato tem no mínimo 10 caracteres; dataHoraConclusao no formato ISO
// LocalDateTime. Pode retornar 409 quando a chamada não está aberta.
export async function finalizarChamada(id, payload) {
  const { data } = await api.patch(`${BASE}/${id}/finalizar`, payload);
  return data;
}

// Cancela uma chamada aberta. Payload: { motivoCancelamento }.
// Pode retornar 409 quando a chamada não está aberta.
export async function cancelarChamada(id, payload) {
  const { data } = await api.patch(`${BASE}/${id}/cancelar`, payload);
  return data;
}
