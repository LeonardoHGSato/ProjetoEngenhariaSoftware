// Serviço de acesso à API de tipos de serviço (/api/v1/tipos-servico).
// O tratamento de erro/token é feito pelos interceptors do cliente em @/lib/api.

import api from "@/lib/api";

const BASE = "/api/v1/tipos-servico";

// Lista os tipos de serviço disponíveis.
// Retorna um array de { id, nome, descricao, tempoMedioMinutos } — o id é o
// nome do enum (ex: "INSTALACAO"), enviado de volta no payload da chamada.
export async function listarTiposServico() {
  const { data } = await api.get(BASE);
  return data;
}
