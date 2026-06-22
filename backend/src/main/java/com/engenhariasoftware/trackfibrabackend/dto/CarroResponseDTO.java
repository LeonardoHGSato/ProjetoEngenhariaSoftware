package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;

public record CarroResponseDTO(
        Long id,
        String placa,
        String modelo,
        String marca,
        Integer ano,
        StatusCarro status
) {
}
