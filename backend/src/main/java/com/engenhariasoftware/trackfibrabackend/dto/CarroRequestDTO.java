package com.engenhariasoftware.trackfibrabackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CarroRequestDTO(

        @NotBlank(message = "A placa é obrigatória")
        @Pattern(regexp = "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$",
                message = "Formato de placa inválido. Use o padrão Antigo (ABC1234) ou Mercosul (ABC1D23)")
        String placa,

        @NotBlank(message = "O modelo é obrigatório")
        String modelo,

        @NotBlank(message = "A marca é obrigatório")
        String marca,

        @NotNull(message = "O ano é obrigatório")
        Integer ano
) {
}
