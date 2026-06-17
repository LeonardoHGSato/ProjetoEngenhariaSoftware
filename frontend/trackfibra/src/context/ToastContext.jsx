"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { registrarHandlerErro } from "@/lib/api";

const ToastContext = createContext(null);

const DURACAO_PADRAO = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const proximoId = useRef(0);

  const removerToast = useCallback((id) => {
    setToasts((atuais) => atuais.filter((toast) => toast.id !== id));
  }, []);

  const adicionarToast = useCallback(
    (mensagem, tipo, duracao = DURACAO_PADRAO) => {
      const id = proximoId.current++;
      setToasts((atuais) => [...atuais, { id, mensagem, tipo }]);

      if (duracao > 0) {
        setTimeout(() => removerToast(id), duracao);
      }

      return id;
    },
    [removerToast],
  );

  useEffect(() => {
    registrarHandlerErro((mensagem) => adicionarToast(mensagem, "error"));
    return () => registrarHandlerErro(null);
  }, [adicionarToast]);

  const toast = {
    success: (mensagem, duracao) => adicionarToast(mensagem, "success", duracao),
    error: (mensagem, duracao) => adicionarToast(mensagem, "error", duracao),
    warning: (mensagem, duracao) => adicionarToast(mensagem, "warning", duracao),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removerToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) {
    throw new Error("useToast deve ser usado dentro de um <ToastProvider>");
  }
  return contexto;
}
