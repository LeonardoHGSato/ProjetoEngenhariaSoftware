// Utilitários de máscara para os formulários (funcionários, clientes, veículos).
// O backend espera apenas dígitos (telefone com 10/11 números, CPF com 11,
// CNPJ com 14, CEP com 8), então as máscaras servem só para exibição: na hora
// de enviar, use apenasDigitos.

// Remove tudo que não for dígito.
export function apenasDigitos(valor) {
  return (valor ?? "").replace(/\D/g, "");
}

// Formata um telefone aplicando a máscara progressivamente conforme o usuário
// digita. Aceita fixo (10 dígitos -> (00) 0000-0000) e celular (11 dígitos ->
// (00) 00000-0000).
export function mascaraTelefone(valor) {
  const digitos = apenasDigitos(valor).slice(0, 11);

  if (digitos.length <= 2) {
    return digitos.replace(/(\d{0,2})/, "$1");
  }
  if (digitos.length <= 6) {
    return digitos.replace(/(\d{2})(\d{0,4})/, "($1) $2");
  }
  if (digitos.length <= 10) {
    return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
  return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

// Formata um CPF como 000.000.000-00, aplicando a máscara progressivamente.
export function mascaraCpf(valor) {
  const digitos = apenasDigitos(valor).slice(0, 11);

  return digitos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// Formata um CNPJ como 00.000.000/0000-00, aplicando a máscara progressivamente.
export function mascaraCnpj(valor) {
  const digitos = apenasDigitos(valor).slice(0, 14);

  return digitos
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

// Máscara dinâmica de CPF/CNPJ: até 11 dígitos usa formato de CPF, acima disso
// usa formato de CNPJ (mesma regra do backend, que diferencia por tamanho).
export function mascaraCpfCnpj(valor) {
  const digitos = apenasDigitos(valor);
  return digitos.length <= 11 ? mascaraCpf(digitos) : mascaraCnpj(digitos);
}

// Formata um CEP como 00000-000, aplicando a máscara progressivamente.
export function mascaraCep(valor) {
  const digitos = apenasDigitos(valor).slice(0, 8);
  return digitos.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

// Valida CPF pelos dígitos verificadores (espelha a validação do backend).
export function cpfValido(cpf) {
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

// Valida CNPJ pelos dígitos verificadores.
export function cnpjValido(cnpj) {
  const d = apenasDigitos(cnpj);
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false;

  const calcular = (qtd) => {
    const pesos =
      qtd === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < qtd; i++) soma += Number(d[i]) * pesos[i];
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return calcular(12) === Number(d[12]) && calcular(13) === Number(d[13]);
}

// Valida CPF (11 dígitos) ou CNPJ (14 dígitos) conforme o tamanho.
export function cpfCnpjValido(valor) {
  const d = apenasDigitos(valor);
  if (d.length === 11) return cpfValido(d);
  if (d.length === 14) return cnpjValido(d);
  return false;
}

// Padrão de placa aceito pelo backend: 3 letras + 1 dígito + 1 alfanumérico + 2 dígitos.
// Cobre o formato antigo (ABC1234) e o Mercosul (ABC1D23).
const PLACA_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

// Normaliza a placa para exibição: maiúsculas, sem separadores, até 7 caracteres.
// A placa não usa hífen nos padrões brasileiros, então a máscara só limpa e limita.
export function mascaraPlaca(valor) {
  return (valor ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
}

// Valida a placa contra o padrão antigo/Mercosul (espelha a validação do backend).
export function placaValida(valor) {
  return PLACA_REGEX.test(mascaraPlaca(valor));
}
