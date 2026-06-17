import axios from "axios";

import { STORAGE_KEYS } from "@/context/AuthContext";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

let handlerErro = null;

export function registrarHandlerErro(handler) {
  handlerErro = handler;
}

const MENSAGENS_PADRAO = {
  409: "Não foi possível concluir: registro em conflito.",
  500: "Erro interno do servidor. Tente novamente mais tarde.",
};

function mensagemDoErro(error) {
  const dados = error.response?.data;
  if (typeof dados === "string" && dados.trim()) {
    return dados;
  }
  if (dados?.message) {
    return dados.message;
  }
  if (error.response?.status && MENSAGENS_PADRAO[error.response.status]) {
    return MENSAGENS_PADRAO[error.response.status];
  }
  if (!error.response) {
    return "Falha de conexão com o servidor.";
  }
  return "Ocorreu um erro inesperado.";
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const tinhaToken =
        localStorage.getItem(STORAGE_KEYS.token) ??
        sessionStorage.getItem(STORAGE_KEYS.token);

      if (tinhaToken) {
        [localStorage, sessionStorage].forEach((storage) =>
          Object.values(STORAGE_KEYS).forEach((chave) =>
            storage.removeItem(chave),
          ),
        );
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
      return Promise.reject(error);
    }

    if (handlerErro) {
      handlerErro(mensagemDoErro(error));
    }

    return Promise.reject(error);
  },
);

export default api;
