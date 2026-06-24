package com.engenhariasoftware.trackfibrabackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChamadaCancelarDTO(
        @NotBlank(message = "O motivo de cancelamento é obrigatório.")
        @Size(min = 10, message = "O motivo deve ter no mínimo 10 caracteres.")
        String motivo
) {}