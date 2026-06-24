// Serviço de acesso à API de clientes (/api/v1/clientes).
// Centraliza os endpoints num só lugar; o tratamento de erro/token é feito
// pelos interceptors do cliente em @/lib/api.

import api from "@/lib/api";

const BASE = "/api/v1/clientes";

// Lista paginada com busca unificada opcional (nome ou CPF/CNPJ).
// Retorna o objeto Page do Spring: { content, totalPages, totalElements, number, ... }.
export async function listarClientes({ busca, page = 0, size = 10 } = {}) {
  const params = { page, size };
  if (busca) params.busca = busca;

  const { data } = await api.get(BASE, { params });
  return data;
}

// Busca um cliente pelo id. Retorna o ClienteResponseDTO completo (com e-mail e
// endereço), usado para pré-preencher o formulário de edição.
export async function buscarCliente(id) {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
}

// Cadastra um cliente. Payload: { nome, cpfCnpj, telefone, email, endereco }.
export async function cadastrarCliente(payload) {
  const { data } = await api.post(BASE, payload);
  return data;
}

// Edita um cliente. Payload: { nome, telefone, email, endereco } (sem CPF/CNPJ).
export async function editarCliente(id, payload) {
  const { data } = await api.put(`${BASE}/${id}`, payload);
  return data;
}

// Desativa (soft delete) um cliente. Pode retornar 409 quando houver conflito.
export async function desativarCliente(id) {
  const { data } = await api.delete(`${BASE}/${id}`);
  return data;
}

// Histórico de chamadas do cliente. inicio e fim são obrigatórios no backend
// (ISO LocalDateTime, ex: "2026-06-23T00:00"). Retorna o Page do Spring de
// ChamadaHistoricoDTO: { content, totalPages, number, first, last, ... }.
export async function historicoCliente(id, { inicio, fim, page = 0, size = 10 }) {
  const { data } = await api.get(`${BASE}/${id}/historico`, {
    params: { inicio, fim, page, size },
  });
  return data;
}
