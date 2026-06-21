package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.validation.CpfCnpjValido;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ClienteRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @CpfCnpjValido
        @NotBlank(message = "O CPF/CNPJ é obrigatório")
        String cpfCnpj,

        @Pattern(regexp = "^\\d{10,11}$", message = "Telefone deve conter apenas números e ter 10 ou 11 dígitos")
        @NotBlank(message = "O telefone é obrigatório")
        String telefone,

        @Email(message = "Formato de email inválido")
        String email,

        @Valid
        @NotNull(message = "O endereço é obrigatório")
        EnderecoDTO endereco
) {
}
