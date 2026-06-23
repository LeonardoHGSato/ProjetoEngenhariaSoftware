"use client";

import { useCallback, useMemo, useState } from "react";
import SelectAssincrono from "@/components/SelectAssincrono";
import { useViaCep } from "@/hooks/useViaCep";
import { apenasDigitos, mascaraCep } from "@/lib/masks";
import { buscarCliente, listarClientes } from "@/services/clientes";
import { listarFuncionarios } from "@/services/funcionarios";
import { listarVeiculos } from "@/services/veiculos";
import { listarTiposServico } from "@/services/tiposServico";
import styles from "./ChamadaForm.module.css";

// Retorna a data/hora atual no formato aceito pelo input datetime-local
// (YYYY-MM-DDTHH:mm), respeitando o fuso local.
function agoraLocalISO() {
  const agora = new Date();
  const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

// Formulário de abertura de chamada: selects assíncronos (cliente, funcionário
// ativo, carro disponível, tipo de serviço), data/hora e endereço pré-preenchido
// a partir do cliente (editável).
export default function ChamadaForm({ onSubmit, enviando = false }) {
  const numeroMin = useMemo(() => agoraLocalISO(), []);
  const { buscarCep, carregando: buscandoCep } = useViaCep();

  const [clienteId, setClienteId] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");
  const [carroId, setCarroId] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [dataHora, setDataHora] = useState("");

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);

  const [erros, setErros] = useState({});

  // Loaders memoizados — o SelectAssincrono os passa ao useAsync, que dispara
  // a busca quando a referência muda; manter estável evita refetch em loop.
  const carregarClientes = useCallback(
    () => listarClientes({ size: 1000 }),
    [],
  );
  const carregarFuncionarios = useCallback(
    () => listarFuncionarios({ status: "ATIVO", size: 1000 }),
    [],
  );
  const carregarCarros = useCallback(
    () => listarVeiculos({ status: "DISPONIVEL", size: 1000 }),
    [],
  );
  const carregarTipos = useCallback(() => listarTiposServico(), []);

  // Ao selecionar um cliente, busca o cadastro completo e pré-preenche o
  // endereço (editável). A listagem não traz o endereço completo.
  async function aoSelecionarCliente(id) {
    setClienteId(id);
    if (!id) return;
    try {
      const cliente = await buscarCliente(id);
      const e = cliente.endereco ?? {};
      setCep(mascaraCep(e.cep ?? ""));
      setRua(e.rua ?? "");
      setNumero(e.numero ?? "");
      setComplemento(e.complemento ?? "");
      setBairro(e.bairro ?? "");
      setCidade(e.cidade ?? "");
      setUf(e.uf ?? "");
      setCepNaoEncontrado(false);
    } catch {
      // Erros já são exibidos via toast pelo interceptor de api.
    }
  }

  // Edição manual do CEP: ao completar 8 dígitos, consulta o ViaCEP.
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
  }

  function validar() {
    const novosErros = {};

    if (!clienteId) novosErros.clienteId = "Selecione um cliente.";
    if (!funcionarioId) novosErros.funcionarioId = "Selecione um funcionário.";
    if (!carroId) novosErros.carroId = "Selecione um carro.";
    if (!tipoServico) novosErros.tipoServico = "Selecione o tipo de serviço.";

    if (!dataHora) novosErros.dataHora = "Informe a data e a hora.";
    else if (dataHora < agoraLocalISO())
      novosErros.dataHora = "A data e hora não podem ser no passado.";

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

    onSubmit?.({
      clienteId: Number(clienteId),
      funcionarioId: Number(funcionarioId),
      carroId: Number(carroId),
      tipoServico,
      dataHora,
      endereco: {
        cep: apenasDigitos(cep),
        rua: rua.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        uf: uf.trim().toUpperCase(),
      },
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <fieldset className={styles.secao} disabled={enviando}>
        <legend className={styles.legenda}>Atribuição</legend>

        <SelectAssincrono
          id="cliente"
          label="Cliente"
          carregar={carregarClientes}
          extrairItens={(d) => d?.content ?? []}
          getLabel={(c) => c.nome}
          value={clienteId}
          onChange={aoSelecionarCliente}
          placeholder="Selecione o cliente..."
          erro={erros.clienteId}
        />

        <SelectAssincrono
          id="funcionario"
          label="Funcionário"
          carregar={carregarFuncionarios}
          extrairItens={(d) => d?.content ?? []}
          getLabel={(f) => f.nome}
          value={funcionarioId}
          onChange={setFuncionarioId}
          placeholder="Selecione o funcionário..."
          erro={erros.funcionarioId}
        />

        <SelectAssincrono
          id="carro"
          label="Carro"
          carregar={carregarCarros}
          extrairItens={(d) => d?.content ?? []}
          getLabel={(v) => `${v.placa} — ${v.modelo}`}
          value={carroId}
          onChange={setCarroId}
          placeholder="Selecione o carro..."
          erro={erros.carroId}
        />

        <SelectAssincrono
          id="tipoServico"
          label="Tipo de serviço"
          carregar={carregarTipos}
          getValue={(t) => t.id}
          getLabel={(t) => t.nome}
          value={tipoServico}
          onChange={setTipoServico}
          placeholder="Selecione o tipo..."
          erro={erros.tipoServico}
        />
      </fieldset>

      <fieldset className={styles.secao} disabled={enviando}>
        <legend className={styles.legenda}>Agendamento</legend>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="dataHora">
            Data e hora
          </label>
          <input
            id="dataHora"
            type="datetime-local"
            min={numeroMin}
            className={`${styles.input} ${erros.dataHora ? styles.inputErro : ""}`}
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
          />
          {erros.dataHora && (
            <span className={styles.erroTexto}>{erros.dataHora}</span>
          )}
        </div>
      </fieldset>

      <fieldset className={styles.secao} disabled={enviando}>
        <legend className={styles.legenda}>Endereço do atendimento</legend>

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
        {enviando ? "Abrindo..." : "Abrir chamada"}
      </button>
    </form>
  );
}
