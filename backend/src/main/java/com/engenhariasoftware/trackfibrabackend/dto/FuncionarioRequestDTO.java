package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.validation.CpfValido;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class FuncionarioRequestDTO {

    private String nome;
    private String email;
    private String senha;
    private String numeroTelefone;
    @CpfValido
    private String cpf;
}
