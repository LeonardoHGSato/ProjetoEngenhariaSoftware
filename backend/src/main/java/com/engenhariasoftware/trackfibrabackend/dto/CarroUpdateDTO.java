package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CarroUpdateDTO(

        @NotBlank(message = "O modelo é obrigatório")
        String modelo,

        @NotBlank(message = "A marca é obrigatória")
        String marca,

        @NotNull(message = "O ano é obrigatório")
        @Min(value = 1990, message = "Ano mínimo é 1990")
        Integer ano,

        StatusCarro status
){
}
