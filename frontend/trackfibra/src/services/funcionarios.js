// Serviço de acesso à API de funcionários (/api/v1/funcionarios).
// Centraliza os endpoints num só lugar; o tratamento de erro/token é feito
// pelos interceptors do cliente em @/lib/api.

import api from "@/lib/api";

const BASE = "/api/v1/funcionarios";

// Lista paginada com filtros opcionais de nome e status.
// Retorna o objeto Page do Spring: { content, totalPages, totalElements, number, ... }.
export async function listarFuncionarios({
  nome,
  status,
  page = 0,
  size = 10,
} = {}) {
  const params = { page, size };
  if (nome) params.nome = nome;
  if (status) params.status = status;

  const { data } = await api.get(BASE, { params });
  return data;
}

// Cadastra um funcionário. Payload: { nome, email, senha, numeroTelefone, cpf }.
export async function cadastrarFuncionario(payload) {
  const { data } = await api.post(BASE, payload);
  return data;
}

// Edita um funcionário. Payload: { nome, email, numeroTelefone, statusFuncionario, perfilFuncionario }.
export async function editarFuncionario(id, payload) {
  const { data } = await api.put(`${BASE}/${id}`, payload);
  return data;
}

// Desativa (soft delete) um funcionário. Pode retornar 409 quando houver conflito.
export async function desativarFuncionario(id) {
  const { data } = await api.delete(`${BASE}/${id}`);
  return data;
}

// Histórico de chamadas atendidas pelo funcionário. inicio e fim são
// obrigatórios no backend (ISO LocalDateTime). Retorna o Page do Spring de
// ChamadaHistoricoDTO: { content, totalPages, number, first, last, ... }.
export async function historicoFuncionario(id, { inicio, fim, page = 0, size = 10 }) {
  const { data } = await api.get(`${BASE}/${id}/historico`, {
    params: { inicio, fim, page, size },
  });
  return data;
}
