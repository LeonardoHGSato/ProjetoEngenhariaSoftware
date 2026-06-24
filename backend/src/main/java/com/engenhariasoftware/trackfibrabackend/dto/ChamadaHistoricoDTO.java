package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;

import java.time.LocalDateTime;

public record ChamadaHistoricoDTO(
        Long id,
        TipoServico tipoServico,
        StatusChamada status,
        LocalDateTime dataHora,
        String relato
) {
    public ChamadaHistoricoDTO(Chamada chamada) {
        this(
                chamada.getId(),
                chamada.getTipoServico(),
                chamada.getStatus(),
                chamada.getDataHora(),
                chamada.getRelato()
        );
    }
}