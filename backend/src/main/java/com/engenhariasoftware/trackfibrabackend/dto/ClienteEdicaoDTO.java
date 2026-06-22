package com.engenhariasoftware.trackfibrabackend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ClienteEdicaoDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(regexp = "^\\d{10,11}$", message = "Telefone deve conter apenas números e ter 10 ou 11 dígitos")
        String telefone,

        @Email(message = "Formato de email inválido")
        String email,

        @NotNull(message = "O endereço é obrigatório")
        @Valid
        EnderecoDTO endereco
){}
