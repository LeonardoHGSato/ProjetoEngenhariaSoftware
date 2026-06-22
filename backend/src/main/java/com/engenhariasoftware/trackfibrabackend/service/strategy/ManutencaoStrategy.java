package com.engenhariasoftware.trackfibrabackend.service.strategy;

import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import org.springframework.stereotype.Component;

@Component
public class ManutencaoStrategy implements TipoChamadaStrategy {

    @Override
    public TipoServico getTipoSuportado() {
        return TipoServico.MANUTENCAO;
    }

    @Override
    public void executar(Chamada chamada) {
        chamada.setRelato(getTipoSuportado().getDescricao());    }
}
