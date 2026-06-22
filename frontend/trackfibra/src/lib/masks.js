// Utilitários de máscara para os formulários de funcionários.
// O backend espera apenas dígitos (telefone com 11 números, CPF com 11),
// então as máscaras servem só para exibição: na hora de enviar, use apenasDigitos.

// Remove tudo que não for dígito.
export function apenasDigitos(valor) {
  return (valor ?? "").replace(/\D/g, "");
}

// Formata um telefone como (00) 00000-0000, aplicando a máscara progressivamente
// conforme o usuário digita (até 11 dígitos).
export function mascaraTelefone(valor) {
  const digitos = apenasDigitos(valor).slice(0, 11);

  if (digitos.length <= 2) {
    return digitos.replace(/(\d{0,2})/, "$1");
  }
  if (digitos.length <= 7) {
    return digitos.replace(/(\d{2})(\d{0,5})/, "($1) $2");
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
