package com.engenhariasoftware.trackfibrabackend.service.strategy;

import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import org.springframework.stereotype.Component;

@Component
public class InstalacaoStrategy implements TipoChamadaStrategy {

    @Override
    public TipoServico getTipoSuportado() {
        return TipoServico.INSTALACAO;
    }

    @Override
    public void executar(Chamada chamada) {
        chamada.setRelato(getTipoSuportado().getDescricao());    }

    @Override
    public void executarFinalizacao(Chamada chamada) {
    }
}
