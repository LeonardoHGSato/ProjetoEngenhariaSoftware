package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.model.Endereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoDTO(

        @Pattern(regexp = "^\\d{8}$", message = "CEP deve conter 8 dígitos")
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

        @Size(min = 2, max = 2, message = "UF deve ter 2 caracteres")
        @NotBlank(message = "O UF é obrigatório")
        String uf
){
    public Endereco toEndereco() {
        return new Endereco(cep, rua, numero, complemento, bairro, cidade, uf);
    }

    public static EnderecoDTO fromEntity(Endereco endereco) {
        return new EnderecoDTO(
                endereco.getCep(),
                endereco.getRua(),
                endereco.getNumero(),
                endereco.getComplemento(),
                endereco.getBairro(),
                endereco.getCidade(),
                endereco.getUf()
        );
    }
}
