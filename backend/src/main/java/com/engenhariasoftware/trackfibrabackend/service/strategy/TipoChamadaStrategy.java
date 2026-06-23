package com.engenhariasoftware.trackfibrabackend.service.strategy;

import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;

public interface TipoChamadaStrategy {
    //Identifica qual é o tipo de serviço que essa classe atende
    TipoServico getTipoSuportado();
    // A regra de negócio que será executada
    void executar(Chamada chamada);
}
