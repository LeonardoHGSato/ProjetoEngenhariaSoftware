package com.engenhariasoftware.trackfibrabackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UsuarioEdicaoDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(regexp = "^\\d{10,11}$", message = "Telefone inválido. Use apenas números com DDD.")
        String telefone
) {}
