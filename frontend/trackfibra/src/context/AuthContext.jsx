"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

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

  // Atualiza o nome exibido (ex: sidebar) após o usuário editar o próprio
  // perfil, persistindo no storage que guarda a sessão atual.
  function atualizarNome(nome) {
    const storage = localStorage.getItem(STORAGE_KEYS.token)
      ? localStorage
      : sessionStorage;
    storage.setItem(STORAGE_KEYS.nome, nome);
    setSession((anterior) => ({
      ...anterior,
      user: anterior.user ? { ...anterior.user, nome } : anterior.user,
    }));
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
        atualizarNome,
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
