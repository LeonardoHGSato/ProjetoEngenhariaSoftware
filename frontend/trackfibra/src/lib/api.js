import axios from "axios";

// Instância central do axios usada por toda a aplicação.
// A URL base aponta para o backend Spring Boot (porta 8080 por padrão).
// Em produção/ambiente local diferente, defina NEXT_PUBLIC_API_URL no .env.local.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta o token JWT em toda requisição autenticada.
// O token é gerenciado pelo AuthContext, mas lido direto do storage aqui
// porque o interceptor roda fora do ciclo de render do React.
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

export default api;
