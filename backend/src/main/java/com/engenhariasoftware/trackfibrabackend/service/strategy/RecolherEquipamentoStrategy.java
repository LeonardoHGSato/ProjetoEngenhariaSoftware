package com.engenhariasoftware.trackfibrabackend.service.strategy;

import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import org.springframework.stereotype.Component;

@Component
public class RecolherEquipamentoStrategy implements TipoChamadaStrategy {

    @Override
    public TipoServico getTipoSuportado() {
        return TipoServico.RECOLHER_EQUIPAMENTO;
    }

    @Override
    public void executar(Chamada chamada) {
        chamada.setRelato(getTipoSuportado().getDescricao());
    }
}
