package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.ChamadaStatusLog;

import java.time.LocalDateTime;

public record UltimaChamadaDTO(
        Long chamadaId,
        String clienteNome,
        String funcionarioNome,
        TipoServico tipoServico,
        StatusChamada status,
        LocalDateTime dataHora
) {
    public UltimaChamadaDTO(ChamadaStatusLog log) {
        this(
                log.getChamada().getId(),
                log.getChamada().getCliente().getNome(),
                log.getChamada().getFuncionario().getNome(),
                log.getChamada().getTipoServico(),
                log.getStatus(),
                log.getAlteradoEm()
        );
    }
}
