"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Chaves usadas no storage. Centralizadas aqui para o interceptor do axios
// (src/lib/api.js) ler exatamente as mesmas.
export const STORAGE_KEYS = {
  token: "token",
  role: "role",
  nome: "nome",
};

function limparStorages() {
  [localStorage, sessionStorage].forEach((storage) => {
    Object.values(STORAGE_KEYS).forEach((chave) => storage.removeItem(chave));
  });
}

export function AuthProvider({ children }) {
  // token/user num único estado; carregando evita "piscar" telas protegidas
  // enquanto a sessão é hidratada do storage (usado pelo PrivateRoute adiante).
  const [session, setSession] = useState({
    token: null,
    user: null,
    carregando: true,
  });

  useEffect(() => {
    const storage = localStorage.getItem(STORAGE_KEYS.token)
      ? localStorage
      : sessionStorage;
    const tokenSalvo = storage.getItem(STORAGE_KEYS.token);

    // A hidratação a partir do storage do navegador só é possível após a
    // montagem (localStorage não existe no SSR), por isso o setState no efeito.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({
      token: tokenSalvo ?? null,
      user: tokenSalvo
        ? {
            nome: storage.getItem(STORAGE_KEYS.nome),
            role: storage.getItem(STORAGE_KEYS.role),
          }
        : null,
      carregando: false,
    });
  }, []);

  // Recebe a resposta do backend ({ token, role, nome }) e persiste a sessão.
  // manterConectado decide entre localStorage (persiste) e sessionStorage (só na aba).
  function login(data, manterConectado = true) {
    const storage = manterConectado ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.token, data.token);
    storage.setItem(STORAGE_KEYS.role, data.role);
    storage.setItem(STORAGE_KEYS.nome, data.nome);

    setSession({
      token: data.token,
      user: { nome: data.nome, role: data.role },
      carregando: false,
    });
  }

  function logout() {
    limparStorages();
    setSession({ token: null, user: null, carregando: false });
  }

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        carregando: session.carregando,
        isAuthenticated: Boolean(session.token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return contexto;
}
