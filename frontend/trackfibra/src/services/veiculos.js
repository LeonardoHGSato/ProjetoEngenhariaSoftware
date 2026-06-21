// Serviço de acesso à API de veículos (/api/v1/carros).
// Centraliza os endpoints num só lugar; o tratamento de erro/token é feito
// pelos interceptors do cliente em @/lib/api.

import api from "@/lib/api";

const BASE = "/api/v1/carros";

// Lista paginada com filtro opcional de status.
// Retorna o objeto Page do Spring: { content, totalPages, totalElements, number, ... }.
export async function listarVeiculos({ status, page = 0, size = 10 } = {}) {
  const params = { page, size };
  if (status) params.status = status;

  const { data } = await api.get(BASE, { params });
  return data;
}

// Busca um veículo pelo id.
export async function buscarVeiculo(id) {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
}

// Cadastra um veículo. Payload: { placa, modelo, marca, ano }.
export async function cadastrarVeiculo(payload) {
  const { data } = await api.post(BASE, payload);
  return data;
}

// Edita um veículo. Payload: { modelo, marca, ano, status } (a placa não é editável).
export async function editarVeiculo(id, payload) {
  const { data } = await api.put(`${BASE}/${id}`, payload);
  return data;
}

// Remove um veículo. Pode retornar 409 quando houver conflito (veículo vinculado).
export async function removerVeiculo(id) {
  const { data } = await api.delete(`${BASE}/${id}`);
  return data;
}
