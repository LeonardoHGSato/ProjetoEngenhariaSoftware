package com.engenhariasoftware.trackfibrabackend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true) //ViaCEP retorna campos que não usamos (ddd, ibge, gia e alguns outros)
public class ViaCepResponseDTO {
    private String cep;
    private String logradouro;
    private String bairo;
    private String localidade;
    private String uf;
    private boolean erro;
}
