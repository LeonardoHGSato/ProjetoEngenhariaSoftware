package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.ViaCepResponseDTO;
import com.engenhariasoftware.trackfibrabackend.exception.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ViaCepService {

    private final RestClient restClient = RestClient.create("https://viacep.com.br/ws");

    public ViaCepResponseDTO buscarEnderecoPorCep(String cep){
        //        \\D remove pontuação
        String cepLimpo = cep.replaceAll("\\D", "");

        ViaCepResponseDTO resposta = restClient.get().uri("/{cep}/json/", cepLimpo)
                .retrieve()
                .body(ViaCepResponseDTO.class);

        if(resposta == null || resposta.isErro()){
            throw new RecursoNaoEncontradoException("CEP não encontrado: " + cep);
        }

        return resposta;
    }
}
