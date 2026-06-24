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
import { meuPerfil, editarMeuPerfil, alterarSenha } from "@/services/usuarios";
import styles from "./meu-perfil.module.css";

// Força mínima da nova senha (espelha a validação do backend): no mínimo 8
// caracteres, contendo letras e números.
const SENHA_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

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

  const [modalSenha, setModalSenha] = useState(false);
  const [senha, setSenha] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmar: "",
  });
  const [enviandoSenha, setEnviandoSenha] = useState(false);

  const novaSenhaValida = SENHA_REGEX.test(senha.novaSenha);
  const confirmaValida =
    senha.confirmar.length > 0 && senha.confirmar === senha.novaSenha;
  const senhaFormValido =
    senha.senhaAtual.length > 0 && novaSenhaValida && confirmaValida;

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

  function abrirModalSenha() {
    setSenha({ senhaAtual: "", novaSenha: "", confirmar: "" });
    setModalSenha(true);
  }

  function fecharModalSenha() {
    if (!enviandoSenha) setModalSenha(false);
  }

  async function confirmarSenha(evento) {
    evento.preventDefault();
    setEnviandoSenha(true);
    try {
      await alterarSenha({
        senhaAtual: senha.senhaAtual,
        novaSenha: senha.novaSenha,
      });
      toast.success("Senha alterada.");
      setModalSenha(false);
    } catch {
      // Erros (ex: senha atual incorreta) já são exibidos via toast pelo
      // interceptor de api.
    } finally {
      setEnviandoSenha(false);
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

            {perfil.carroPlaca && (
              <div className={styles.campo}>
                <label className={styles.label} htmlFor="carro">
                  Carro atribuído
                </label>
                <input
                  id="carro"
                  className={styles.input}
                  value={perfil.carroPlaca}
                  disabled
                />
              </div>
            )}

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
              <button
                type="button"
                className={styles.botaoSenha}
                onClick={abrirModalSenha}
                disabled={enviando}
              >
                Alterar senha
              </button>
            </div>
          </form>
        )}

        {modalSenha && (
          <div className={styles.overlay} onClick={fecharModalSenha}>
            <form
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              onSubmit={confirmarSenha}
            >
              <h2 className={styles.modalTitulo}>Alterar senha</h2>

              <label className={styles.campo}>
                <span className={styles.label}>Senha atual</span>
                <input
                  type="password"
                  className={styles.input}
                  value={senha.senhaAtual}
                  onChange={(e) =>
                    setSenha((s) => ({ ...s, senhaAtual: e.target.value }))
                  }
                  autoComplete="current-password"
                  required
                />
              </label>

              <label className={styles.campo}>
                <span className={styles.label}>Nova senha</span>
                <input
                  type="password"
                  className={styles.input}
                  value={senha.novaSenha}
                  onChange={(e) =>
                    setSenha((s) => ({ ...s, novaSenha: e.target.value }))
                  }
                  autoComplete="new-password"
                  required
                />
                <span
                  className={`${styles.dica} ${
                    senha.novaSenha.length === 0 || novaSenhaValida
                      ? ""
                      : styles.dicaInvalida
                  }`}
                >
                  Mínimo 8 caracteres, com letras e números.
                </span>
              </label>

              <label className={styles.campo}>
                <span className={styles.label}>Confirmar nova senha</span>
                <input
                  type="password"
                  className={styles.input}
                  value={senha.confirmar}
                  onChange={(e) =>
                    setSenha((s) => ({ ...s, confirmar: e.target.value }))
                  }
                  autoComplete="new-password"
                  required
                />
                {senha.confirmar.length > 0 && !confirmaValida && (
                  <span className={styles.erroTexto}>
                    As senhas não conferem.
                  </span>
                )}
              </label>

              <div className={styles.modalAcoes}>
                <button
                  type="button"
                  className={styles.botaoSecundario}
                  onClick={fecharModalSenha}
                  disabled={enviandoSenha}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={styles.botaoSalvar}
                  disabled={enviandoSenha || !senhaFormValido}
                >
                  {enviandoSenha ? "Aguarde..." : "Alterar senha"}
                </button>
              </div>
            </form>
          </div>
        )}
      </AppShell>
    </PrivateRoute>
  );
}
