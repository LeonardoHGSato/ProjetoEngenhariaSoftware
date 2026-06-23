package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record ChamadaRequestDTO(
        @NotNull(message = "O ID do cliente é obrigatório")
        Long clienteId,

        @NotNull(message = "O ID do funcionário é obrigatório")
        Long funcionarioId,

        @NotNull(message = "O ID do carro é obrigatório")
        Long carroId,

        @NotNull(message = "O tipo de serviço é obrigatório")
        TipoServico tipoServico,

        @NotNull(message = "A data e hora são obrigatórias")
        @FutureOrPresent(message = "A data e hora não podem ser no passado")
        LocalDateTime dataHora,

        @Valid
        EnderecoDTO endereco
) {}
