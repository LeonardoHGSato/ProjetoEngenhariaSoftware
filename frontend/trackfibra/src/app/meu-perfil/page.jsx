"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PrivateRoute from "@/components/PrivateRoute";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useAsync } from "@/hooks/useAsync";
import { apenasDigitos, mascaraCpf, mascaraTelefone } from "@/lib/masks";
import { meuPerfil, editarMeuPerfil } from "@/services/usuarios";
import styles from "./meu-perfil.module.css";

export default function MeuPerfilPage() {
  const { toast } = useToast();
  const { atualizarNome } = useAuth();

  const {
    dados: perfil,
    erro,
    carregando,
    executar: recarregar,
  } = useAsync(meuPerfil);

  const [form, setForm] = useState({ nome: "", telefone: "" });
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Pré-preenche o formulário quando o perfil é carregado (ou recarregado).
  useEffect(() => {
    if (perfil) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        nome: perfil.nome ?? "",
        telefone: mascaraTelefone(perfil.numeroTelefone ?? ""),
      });
    }
  }, [perfil]);

  function validar() {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "O nome é obrigatório.";
    const digitos = apenasDigitos(form.telefone);
    if (digitos.length !== 10 && digitos.length !== 11)
      novosErros.telefone = "Telefone inválido. Use DDD + número.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      const atualizado = await editarMeuPerfil({
        nome: form.nome.trim(),
        telefone: apenasDigitos(form.telefone),
      });
      toast.success("Perfil atualizado.");
      atualizarNome(atualizado.nome);
    } catch {
      // Erros já são exibidos via toast pelo interceptor de api.
    } finally {
      setEnviando(false);
    }
  }

  return (
    <PrivateRoute>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Meu perfil</h1>
        </div>

        {carregando ? (
          <Loading mensagem="Carregando perfil..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar o perfil."
            onRetry={recarregar}
          />
        ) : !perfil ? null : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.campo}>
              <label className={styles.label} htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                className={`${styles.input} ${erros.nome ? styles.inputErro : ""}`}
                value={form.nome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome: e.target.value }))
                }
                disabled={enviando}
              />
              {erros.nome && (
                <span className={styles.erroTexto}>{erros.nome}</span>
              )}
            </div>

            <div className={styles.linha}>
              <div className={styles.campo}>
                <label className={styles.label} htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  className={styles.input}
                  value={perfil.email ?? ""}
                  disabled
                />
              </div>

              <div className={styles.campo}>
                <label className={styles.label} htmlFor="cpf">
                  CPF
                </label>
                <input
                  id="cpf"
                  className={styles.input}
                  value={mascaraCpf(perfil.cpf ?? "")}
                  disabled
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label className={styles.label} htmlFor="telefone">
                Telefone
              </label>
              <input
                id="telefone"
                inputMode="numeric"
                className={`${styles.input} ${
                  erros.telefone ? styles.inputErro : ""
                }`}
                value={form.telefone}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    telefone: mascaraTelefone(e.target.value),
                  }))
                }
                disabled={enviando}
              />
              {erros.telefone && (
                <span className={styles.erroTexto}>{erros.telefone}</span>
              )}
            </div>

            <div className={styles.acoes}>
              <button
                type="submit"
                className={styles.botaoSalvar}
                disabled={enviando}
              >
                {enviando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}
      </AppShell>
    </PrivateRoute>
  );
}
