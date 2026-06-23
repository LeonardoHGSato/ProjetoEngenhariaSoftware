package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import java.time.LocalDateTime;

public record ChamadaResponseDTO(
        Long id,
        Long clienteId,
        String clienteNome,
        Long funcionarioId,
        String funcionarioNome,
        Long carroId,
        String carroPlaca,
        TipoServico tipoServico,
        StatusChamada status,
        LocalDateTime dataHora,
        EnderecoDTO endereco,
        String relato,
        String motivoCancelamento
) {
    public ChamadaResponseDTO(Chamada c) {
        this(
                c.getId(),
                c.getCliente().getId(),
                c.getCliente().getNome(),
                c.getFuncionario().getId(),
                c.getFuncionario().getNome(),
                c.getCarro().getId(),
                c.getCarro().getPlaca(),
                c.getTipoServico(),
                c.getStatus(),
                c.getDataHora(),
                c.getEndereco() != null ? EnderecoDTO.fromEntity(c.getEndereco()) : null,
                c.getRelato(),
                c.getMotivoCancelamento()
        );
    }
}
