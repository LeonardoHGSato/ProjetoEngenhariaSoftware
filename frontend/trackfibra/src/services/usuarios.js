// Serviço de acesso à API do usuário autenticado (/api/v1/usuarios/me).
// O tratamento de erro/token é feito pelos interceptors do cliente em @/lib/api.

import api from "@/lib/api";

const BASE = "/api/v1/usuarios";

// Dados do perfil do usuário logado. Retorna o UsuarioPerfilDTO:
// { id, nome, email, cpf, numeroTelefone, statusFuncionario, perfilFuncionario }.
export async function meuPerfil() {
  const { data } = await api.get(`${BASE}/me`);
  return data;
}

// Edita o próprio perfil. Payload: { nome, telefone } (telefone com 10/11
// dígitos, apenas números). Retorna o UsuarioPerfilDTO atualizado.
export async function editarMeuPerfil(payload) {
  const { data } = await api.patch(`${BASE}/me`, payload);
  return data;
}

// Altera a própria senha. Payload: { senhaAtual, novaSenha }. Não retorna
// conteúdo (204). Pode retornar 400/409 quando a senha atual está incorreta.
export async function alterarSenha(payload) {
  await api.patch(`${BASE}/me/senha`, payload);
}
