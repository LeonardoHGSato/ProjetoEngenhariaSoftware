"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [manterConectado, setManterConectado] = useState(true);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [emailErro, setEmailErro] = useState("");
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function validarEmail() {
    if (!email.trim()) {
      setEmailErro("O e-mail é obrigatório");
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailErro("Formato de e-mail inválido");
      return false;
    }
    setEmailErro("");
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErroGeral("");

    if (!validarEmail()) return;
    if (!senha) {
      setErroGeral("A senha é obrigatória");
      return;
    }

    setEnviando(true);
    try {
      const { data } = await api.post("/api/v1/auth/login", { email, senha });

      // Persiste a sessão via AuthContext (token + dados do usuário).
      login(data, manterConectado);

      router.push("/");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setErroGeral("E-mail ou senha incorretos.");
      } else {
        setErroGeral("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.titulo}>Entrar na sua conta</h1>
        <p className={styles.subtitulo}>Acesse o painel de gestão de chamadas.</p>

        {erroGeral && <div className={styles.alerta}>{erroGeral}</div>}

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="email">
            E-mail
          </label>
          <div
            className={`${styles.inputWrapper} ${emailErro ? styles.inputErro : ""}`}
          >
            <MailIcon />
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="voce@trackfibra.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validarEmail}
              autoComplete="email"
            />
          </div>
          {emailErro && <span className={styles.erroTexto}>{emailErro}</span>}
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="senha">
            Senha
          </label>
          <div className={styles.inputWrapper}>
            <LockIcon />
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              className={styles.input}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.olho}
              onClick={() => setMostrarSenha((v) => !v)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <label className={styles.manter}>
          <input
            type="checkbox"
            checked={manterConectado}
            onChange={(e) => setManterConectado(e.target.checked)}
          />
          <span>Manter conectado</span>
        </label>

        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function MailIcon() {
  return (
    <svg className={styles.icone} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className={styles.icone} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className={styles.icone} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className={styles.icone} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 6.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.2 6.3A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4.1-.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
