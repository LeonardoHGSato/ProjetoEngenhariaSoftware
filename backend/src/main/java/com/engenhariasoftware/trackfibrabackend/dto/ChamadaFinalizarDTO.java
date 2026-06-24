package com.engenhariasoftware.trackfibrabackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record ChamadaFinalizarDTO (
    @NotBlank(message = "O relatório é obrigatório.")
    @Size(min = 10, message = "O relato deve ter no mínimo 10 caracteres.")
    String relato,

    @NotNull(message = "A data e a hora de conclusão são obrigatórias.")
    LocalDateTime dataHoraConclusao
){}