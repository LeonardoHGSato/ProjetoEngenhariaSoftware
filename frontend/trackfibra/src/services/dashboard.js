// Serviço de acesso à API do dashboard (/api/v1/dashboard).
// O tratamento de erro/token é feito pelos interceptors do cliente em @/lib/api.

import api from "@/lib/api";

const BASE = "/api/v1/dashboard";

// Resumo do dashboard do usuário autenticado. O backend escopa o conteúdo
// pelo perfil:
//  - SUPERVISOR: { chamadasAbertas, carrosDisponiveis, tecnicosAtivos,
//      carrosPorStatus: { disponiveis, emUso, emManutencao }, ultimasChamadas }.
//  - TECNICO: { minhasChamadasAbertas, minhasChamadas }.
export async function buscarResumo() {
  const { data } = await api.get(`${BASE}/resumo`);
  return data;
}
