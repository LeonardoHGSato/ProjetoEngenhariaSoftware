package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;

import java.time.LocalDateTime;

public record ChamadaListagemDTO(
    Long id,
    String clienteNome,
    String funcionarioNome,
    TipoServico tipoServico,
    StatusChamada status,
    LocalDateTime dataHora,
    String cidade
) {
    public ChamadaListagemDTO(Chamada chamada){
        this(
                chamada.getId(),
                chamada.getCliente().getNome(),
                chamada.getFuncionario().getNome(),
                chamada.getTipoServico(),
                chamada.getStatus(),
                chamada.getDataHora(),
                chamada.getEndereco().getCidade()
        );
    }
}
