"use client";

import { useAsync } from "@/hooks/useAsync";
import styles from "./SelectAssincrono.module.css";

// Select cujas opções são carregadas da API.
// Props:
//  - id, label: identificação e rótulo do campo.
//  - carregar: função (ESTÁVEL, memoizada com useCallback no pai) que retorna
//    uma Promise com os dados da API. É passada ao useAsync.
//  - extrairItens: extrai o array de itens da resposta (ex: page.content).
//  - getValue / getLabel: mapeiam cada item para o value e o texto da opção.
//  - value, onChange(valor): valor selecionado (string) e callback.
//  - placeholder, erro (texto de validação), disabled.
export default function SelectAssincrono({
  id,
  label,
  carregar,
  extrairItens = (dados) => dados ?? [],
  getValue = (item) => item.id,
  getLabel = (item) => item.nome,
  value,
  onChange,
  placeholder = "Selecione...",
  erro,
  disabled = false,
}) {
  const {
    dados,
    erro: erroCarregar,
    carregando,
    executar,
  } = useAsync(carregar);

  const itens = extrairItens(dados);

  return (
    <div className={styles.campo}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={`${styles.input} ${erro ? styles.inputErro : ""}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled || carregando || Boolean(erroCarregar)}
      >
        <option value="">
          {carregando
            ? "Carregando..."
            : erroCarregar
              ? "Falha ao carregar"
              : placeholder}
        </option>
        {itens.map((item) => (
          <option key={getValue(item)} value={getValue(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
      {erroCarregar && (
        <button
          type="button"
          className={styles.tentarNovamente}
          onClick={executar}
        >
          Tentar novamente
        </button>
      )}
      {erro && <span className={styles.erroTexto}>{erro}</span>}
    </div>
  );
}
