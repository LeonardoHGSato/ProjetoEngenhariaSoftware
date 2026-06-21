package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.model.Endereco;
import jakarta.validation.constraints.NotBlank;

public record EnderecoDTO(
        @NotBlank(message = "O CEP é obrigatório")
        String cep,

        @NotBlank(message = "A rua é obrigatória")
        String rua,

        @NotBlank(message = "O número é obrigatório")
        String numero,

        String complemento,

        @NotBlank(message = "O bairro é obrigatório")
        String bairro,

        @NotBlank(message = "A cidade é obrigatória")
        String cidade,

        @NotBlank(message = "O UF é obrigatório")
        String uf
) {
    public Endereco toEndereco() {
        return new Endereco(cep, rua, numero, complemento, bairro, cidade, uf);
    }
}
