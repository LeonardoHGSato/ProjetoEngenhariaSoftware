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
