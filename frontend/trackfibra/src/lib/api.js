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

export default api;
