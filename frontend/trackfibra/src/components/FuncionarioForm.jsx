"use client";

import { useState } from "react";
import { apenasDigitos, mascaraCpf, mascaraTelefone } from "@/lib/masks";
import styles from "./FuncionarioForm.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida CPF pelos dígitos verificadores (espelha a validação @CpfValido do backend).
function cpfValido(cpf) {
  const d = apenasDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  const calcular = (qtd) => {
    let soma = 0;
    for (let i = 0; i < qtd; i++) soma += Number(d[i]) * (qtd + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return calcular(9) === Number(d[9]) && calcular(10) === Number(d[10]);
}

// Formulário reutilizável de funcionário.
//  - modo "criar": exige senha e CPF.
//  - modo "editar": exige status e perfil (sem senha/CPF, como o backend espera).
//  - valoresIniciais: pré-preenche os campos (usado na edição).
//  - onSubmit(payload): recebe o payload já pronto para a API (telefone/CPF só com dígitos).
//  - enviando: desabilita os campos enquanto a requisição roda.
export default function FuncionarioForm({
  modo = "criar",
  valoresIniciais = {},
  onSubmit,
  enviando = false,
}) {
  const criando = modo === "criar";

  const [nome, setNome] = useState(valoresIniciais.nome ?? "");
  const [email, setEmail] = useState(valoresIniciais.email ?? "");
  const [telefone, setTelefone] = useState(
    mascaraTelefone(valoresIniciais.numeroTelefone ?? ""),
  );
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState(mascaraCpf(valoresIniciais.cpf ?? ""));
  const [status, setStatus] = useState(
    valoresIniciais.statusFuncionario ?? "ATIVO",
  );
  const [perfil, setPerfil] = useState(
    valoresIniciais.perfilFuncionario ?? "TECNICO",
  );

  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "O nome é obrigatório.";

    if (!email.trim()) novosErros.email = "O e-mail é obrigatório.";
    else if (!EMAIL_REGEX.test(email))
      novosErros.email = "Formato de e-mail inválido.";

    if (apenasDigitos(telefone).length !== 11)
      novosErros.telefone = "Telefone inválido. Use DDD + número (11 dígitos).";

    if (criando) {
      if (!senha) novosErros.senha = "A senha é obrigatória.";
      else if (senha.length < 6)
        novosErros.senha = "A senha deve ter no mínimo 6 caracteres.";
      if (!cpfValido(cpf)) novosErros.cpf = "CPF inválido.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    if (!validar()) return;

    const payload = criando
      ? {
          nome: nome.trim(),
          email: email.trim(),
          senha,
          numeroTelefone: apenasDigitos(telefone),
          cpf: apenasDigitos(cpf),
        }
      : {
          nome: nome.trim(),
          email: email.trim(),
          numeroTelefone: apenasDigitos(telefone),
          statusFuncionario: status,
          perfilFuncionario: perfil,
        };

    onSubmit?.(payload);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="nome">
          Nome
        </label>
        <input
          id="nome"
          className={`${styles.input} ${erros.nome ? styles.inputErro : ""}`}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={enviando}
        />
        {erros.nome && <span className={styles.erroTexto}>{erros.nome}</span>}
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          className={`${styles.input} ${erros.email ? styles.inputErro : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={enviando}
        />
        {erros.email && <span className={styles.erroTexto}>{erros.email}</span>}
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="telefone">
          Telefone
        </label>
        <input
          id="telefone"
          inputMode="numeric"
          placeholder="(00) 00000-0000"
          className={`${styles.input} ${erros.telefone ? styles.inputErro : ""}`}
          value={telefone}
          onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
          disabled={enviando}
        />
        {erros.telefone && (
          <span className={styles.erroTexto}>{erros.telefone}</span>
        )}
      </div>

      {criando && (
        <>
          <div className={styles.campo}>
            <label className={styles.label} htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className={`${styles.input} ${erros.senha ? styles.inputErro : ""}`}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={enviando}
              autoComplete="new-password"
            />
            {erros.senha && (
              <span className={styles.erroTexto}>{erros.senha}</span>
            )}
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="cpf">
              CPF
            </label>
            <input
              id="cpf"
              inputMode="numeric"
              placeholder="000.000.000-00"
              className={`${styles.input} ${erros.cpf ? styles.inputErro : ""}`}
              value={cpf}
              onChange={(e) => setCpf(mascaraCpf(e.target.value))}
              disabled={enviando}
            />
            {erros.cpf && <span className={styles.erroTexto}>{erros.cpf}</span>}
          </div>
        </>
      )}

      {!criando && (
        <>
          <div className={styles.campo}>
            <label className={styles.label} htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={enviando}
            >
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="perfil">
              Perfil
            </label>
            <select
              id="perfil"
              className={styles.input}
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              disabled={enviando}
            >
              <option value="TECNICO">Técnico</option>
              <option value="SUPERVISOR">Supervisor</option>
            </select>
          </div>
        </>
      )}

      <button type="submit" className={styles.botao} disabled={enviando}>
        {enviando ? "Salvando..." : criando ? "Cadastrar" : "Salvar alterações"}
      </button>
    </form>
  );
}
