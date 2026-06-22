package com.engenhariasoftware.trackfibrabackend.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
//TODO: Ao de implementar os chamados, o endereço precisa ser copiado em um novo objeto Endereço, não por referência para não alterar o histórico.
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Endereco {

    @NotBlank(message = "O CEP é obrigatório")
    private String cep;

    @NotBlank(message = "A rua é obrigatória")
    private String rua;

    @NotBlank(message = "O número é obrigatório")
    private String numero;

    private String complemento;

    @NotBlank(message = "O bairro é obrigatório")
    private String bairro;

    @NotBlank(message = "A cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "O UF é obrigatório")
    private String uf;
}
