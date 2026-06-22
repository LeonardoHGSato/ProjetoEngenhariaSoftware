"use client";

import { useState } from "react";
import { mascaraPlaca, placaValida } from "@/lib/masks";
import styles from "./VeiculoForm.module.css";

const ANO_MINIMO = 1990;
const ANO_MAXIMO = new Date().getFullYear() + 1;

// Formulário reutilizável de veículo.
//  - modo "criar": exige placa, modelo, marca e ano.
//  - modo "editar": placa fica desabilitada (não é editável no backend) e
//    aparece o campo de status.
//  - valoresIniciais: pré-preenche os campos (usado na edição).
//  - onSubmit(payload): recebe o payload já pronto para a API.
//  - enviando: desabilita os campos enquanto a requisição roda.
export default function VeiculoForm({
  modo = "criar",
  valoresIniciais = {},
  onSubmit,
  enviando = false,
}) {
  const criando = modo === "criar";

  const [placa, setPlaca] = useState(mascaraPlaca(valoresIniciais.placa ?? ""));
  const [modelo, setModelo] = useState(valoresIniciais.modelo ?? "");
  const [marca, setMarca] = useState(valoresIniciais.marca ?? "");
  const [ano, setAno] = useState(
    valoresIniciais.ano != null ? String(valoresIniciais.ano) : "",
  );
  const [status, setStatus] = useState(valoresIniciais.status ?? "DISPONIVEL");

  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};

    if (criando && !placaValida(placa)) {
      novosErros.placa =
        "Placa inválida. Use o padrão antigo (ABC1234) ou Mercosul (ABC1D23).";
    }

    if (!modelo.trim()) novosErros.modelo = "O modelo é obrigatório.";
    if (!marca.trim()) novosErros.marca = "A marca é obrigatória.";

    const anoNumero = Number(ano);
    if (!ano.trim()) {
      novosErros.ano = "O ano é obrigatório.";
    } else if (!Number.isInteger(anoNumero)) {
      novosErros.ano = "Ano inválido.";
    } else if (anoNumero < ANO_MINIMO || anoNumero > ANO_MAXIMO) {
      novosErros.ano = `O ano deve estar entre ${ANO_MINIMO} e ${ANO_MAXIMO}.`;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    if (!validar()) return;

    const payload = criando
      ? {
          placa,
          modelo: modelo.trim(),
          marca: marca.trim(),
          ano: Number(ano),
        }
      : {
          modelo: modelo.trim(),
          marca: marca.trim(),
          ano: Number(ano),
          status,
        };

    onSubmit?.(payload);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="placa">
          Placa
        </label>
        <input
          id="placa"
          placeholder="ABC1D23"
          className={`${styles.input} ${erros.placa ? styles.inputErro : ""}`}
          value={placa}
          onChange={(e) => setPlaca(mascaraPlaca(e.target.value))}
          disabled={enviando || !criando}
        />
        {!criando && (
          <span className={styles.ajuda}>A placa não pode ser alterada.</span>
        )}
        {erros.placa && <span className={styles.erroTexto}>{erros.placa}</span>}
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="modelo">
          Modelo
        </label>
        <input
          id="modelo"
          className={`${styles.input} ${erros.modelo ? styles.inputErro : ""}`}
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          disabled={enviando}
        />
        {erros.modelo && (
          <span className={styles.erroTexto}>{erros.modelo}</span>
        )}
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="marca">
          Marca
        </label>
        <input
          id="marca"
          className={`${styles.input} ${erros.marca ? styles.inputErro : ""}`}
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          disabled={enviando}
        />
        {erros.marca && <span className={styles.erroTexto}>{erros.marca}</span>}
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ano">
          Ano
        </label>
        <input
          id="ano"
          inputMode="numeric"
          placeholder="2024"
          className={`${styles.input} ${erros.ano ? styles.inputErro : ""}`}
          value={ano}
          onChange={(e) => setAno(e.target.value.replace(/\D/g, "").slice(0, 4))}
          disabled={enviando}
        />
        {erros.ano && <span className={styles.erroTexto}>{erros.ano}</span>}
      </div>

      {!criando && (
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
            <option value="DISPONIVEL">Disponível</option>
            <option value="EM_USO">Em uso</option>
            <option value="MANUTENCAO">Manutenção</option>
            <option value="DESATIVADO">Desativado</option>
          </select>
        </div>
      )}

      <button type="submit" className={styles.botao} disabled={enviando}>
        {enviando ? "Salvando..." : criando ? "Cadastrar" : "Salvar alterações"}
      </button>
    </form>
  );
}
