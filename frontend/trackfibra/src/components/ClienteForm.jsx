"use client";

import { useRef, useState } from "react";
import {
  apenasDigitos,
  cpfCnpjValido,
  mascaraCep,
  mascaraCpfCnpj,
  mascaraTelefone,
} from "@/lib/masks";
import { useViaCep } from "@/hooks/useViaCep";
import styles from "./ClienteForm.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formulário reutilizável de cliente, dividido em seções (dados, contato e
// endereço).
//  - modo "criar": exige CPF/CNPJ.
//  - modo "editar": CPF/CNPJ fica desabilitado (o backend não permite alterá-lo).
//  - valoresIniciais: pré-preenche os campos (usado na edição).
//  - onSubmit(payload): recebe o payload pronto para a API (dígitos crus em
//    cpfCnpj/telefone/cep).
//  - enviando: desabilita os campos enquanto a requisição roda.
export default function ClienteForm({
  modo = "criar",
  valoresIniciais = {},
  onSubmit,
  enviando = false,
}) {
  const criando = modo === "criar";
  const endInicial = valoresIniciais.endereco ?? {};

  const numeroRef = useRef(null);
  const { buscarCep, carregando: buscandoCep } = useViaCep();

  const [nome, setNome] = useState(valoresIniciais.nome ?? "");
  const [cpfCnpj, setCpfCnpj] = useState(
    mascaraCpfCnpj(valoresIniciais.cpfCnpj ?? ""),
  );
  const [telefone, setTelefone] = useState(
    mascaraTelefone(valoresIniciais.telefone ?? ""),
  );
  const [email, setEmail] = useState(valoresIniciais.email ?? "");

  const [cep, setCep] = useState(mascaraCep(endInicial.cep ?? ""));
  const [rua, setRua] = useState(endInicial.rua ?? "");
  const [numero, setNumero] = useState(endInicial.numero ?? "");
  const [complemento, setComplemento] = useState(endInicial.complemento ?? "");
  const [bairro, setBairro] = useState(endInicial.bairro ?? "");
  const [cidade, setCidade] = useState(endInicial.cidade ?? "");
  const [uf, setUf] = useState(endInicial.uf ?? "");
  const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);

  const [erros, setErros] = useState({});

  // Ao completar 8 dígitos do CEP, consulta o ViaCEP e preenche o endereço.
  async function aoMudarCep(valor) {
    setCep(mascaraCep(valor));
    setCepNaoEncontrado(false);

    if (apenasDigitos(valor).length !== 8) return;

    const endereco = await buscarCep(valor);
    if (!endereco) {
      setCepNaoEncontrado(true);
      return;
    }

    setRua(endereco.rua);
    setBairro(endereco.bairro);
    setCidade(endereco.cidade);
    setUf(endereco.uf);
    numeroRef.current?.focus();
  }

  function validar() {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "O nome é obrigatório.";

    if (criando && !cpfCnpjValido(cpfCnpj))
      novosErros.cpfCnpj = "CPF/CNPJ inválido.";

    const digitosTelefone = apenasDigitos(telefone).length;
    if (digitosTelefone !== 10 && digitosTelefone !== 11)
      novosErros.telefone = "Telefone inválido. Use DDD + número (10 ou 11 dígitos).";

    if (email.trim() && !EMAIL_REGEX.test(email))
      novosErros.email = "Formato de e-mail inválido.";

    if (apenasDigitos(cep).length !== 8)
      novosErros.cep = "CEP inválido. Use 8 dígitos.";
    if (!rua.trim()) novosErros.rua = "A rua é obrigatória.";
    if (!numero.trim()) novosErros.numero = "O número é obrigatório.";
    if (!bairro.trim()) novosErros.bairro = "O bairro é obrigatório.";
    if (!cidade.trim()) novosErros.cidade = "A cidade é obrigatória.";
    if (uf.trim().length !== 2) novosErros.uf = "UF deve ter 2 caracteres.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    if (!validar()) return;

    const endereco = {
      cep: apenasDigitos(cep),
      rua: rua.trim(),
      numero: numero.trim(),
      complemento: complemento.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      uf: uf.trim().toUpperCase(),
    };

    const payload = criando
      ? {
          nome: nome.trim(),
          cpfCnpj: apenasDigitos(cpfCnpj),
          telefone: apenasDigitos(telefone),
          email: email.trim(),
          endereco,
        }
      : {
          nome: nome.trim(),
          telefone: apenasDigitos(telefone),
          email: email.trim(),
          endereco,
        };

    onSubmit?.(payload);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <fieldset className={styles.secao} disabled={enviando}>
        <legend className={styles.legenda}>Dados do cliente</legend>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="nome">
            Nome
          </label>
          <input
            id="nome"
            className={`${styles.input} ${erros.nome ? styles.inputErro : ""}`}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          {erros.nome && <span className={styles.erroTexto}>{erros.nome}</span>}
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="cpfCnpj">
            CPF/CNPJ
          </label>
          <input
            id="cpfCnpj"
            inputMode="numeric"
            placeholder="000.000.000-00"
            className={`${styles.input} ${erros.cpfCnpj ? styles.inputErro : ""}`}
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(mascaraCpfCnpj(e.target.value))}
            disabled={!criando}
            title={
              criando ? undefined : "Não é possível alterar o CPF/CNPJ."
            }
          />
          {erros.cpfCnpj && (
            <span className={styles.erroTexto}>{erros.cpfCnpj}</span>
          )}
        </div>
      </fieldset>

      <fieldset className={styles.secao} disabled={enviando}>
        <legend className={styles.legenda}>Contato</legend>

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
          />
          {erros.telefone && (
            <span className={styles.erroTexto}>{erros.telefone}</span>
          )}
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="email">
            E-mail <span className={styles.opcional}>(opcional)</span>
          </label>
          <input
            id="email"
            type="email"
            className={`${styles.input} ${erros.email ? styles.inputErro : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {erros.email && (
            <span className={styles.erroTexto}>{erros.email}</span>
          )}
        </div>
      </fieldset>

      <fieldset className={styles.secao} disabled={enviando}>
        <legend className={styles.legenda}>Endereço</legend>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="cep">
            CEP
          </label>
          <input
            id="cep"
            inputMode="numeric"
            placeholder="00000-000"
            className={`${styles.input} ${erros.cep ? styles.inputErro : ""}`}
            value={cep}
            onChange={(e) => aoMudarCep(e.target.value)}
          />
          {buscandoCep && (
            <span className={styles.dica}>Buscando endereço...</span>
          )}
          {cepNaoEncontrado && (
            <span className={styles.dica}>
              CEP não encontrado. Preencha o endereço manualmente.
            </span>
          )}
          {erros.cep && <span className={styles.erroTexto}>{erros.cep}</span>}
        </div>

        <div className={styles.linha}>
          <div className={`${styles.campo} ${styles.cresce}`}>
            <label className={styles.label} htmlFor="rua">
              Rua
            </label>
            <input
              id="rua"
              className={`${styles.input} ${erros.rua ? styles.inputErro : ""}`}
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
            {erros.rua && <span className={styles.erroTexto}>{erros.rua}</span>}
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="numero">
              Número
            </label>
            <input
              id="numero"
              ref={numeroRef}
              className={`${styles.input} ${erros.numero ? styles.inputErro : ""}`}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
            {erros.numero && (
              <span className={styles.erroTexto}>{erros.numero}</span>
            )}
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="complemento">
            Complemento <span className={styles.opcional}>(opcional)</span>
          </label>
          <input
            id="complemento"
            className={styles.input}
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>

        <div className={styles.linha}>
          <div className={`${styles.campo} ${styles.cresce}`}>
            <label className={styles.label} htmlFor="bairro">
              Bairro
            </label>
            <input
              id="bairro"
              className={`${styles.input} ${erros.bairro ? styles.inputErro : ""}`}
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
            {erros.bairro && (
              <span className={styles.erroTexto}>{erros.bairro}</span>
            )}
          </div>

          <div className={`${styles.campo} ${styles.cresce}`}>
            <label className={styles.label} htmlFor="cidade">
              Cidade
            </label>
            <input
              id="cidade"
              className={`${styles.input} ${erros.cidade ? styles.inputErro : ""}`}
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
            {erros.cidade && (
              <span className={styles.erroTexto}>{erros.cidade}</span>
            )}
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="uf">
              UF
            </label>
            <input
              id="uf"
              maxLength={2}
              className={`${styles.input} ${styles.inputUf} ${erros.uf ? styles.inputErro : ""}`}
              value={uf}
              onChange={(e) => setUf(e.target.value.toUpperCase())}
            />
            {erros.uf && <span className={styles.erroTexto}>{erros.uf}</span>}
          </div>
        </div>
      </fieldset>

      <button type="submit" className={styles.botao} disabled={enviando}>
        {enviando ? "Salvando..." : criando ? "Cadastrar" : "Salvar alterações"}
      </button>
    </form>
  );
}
