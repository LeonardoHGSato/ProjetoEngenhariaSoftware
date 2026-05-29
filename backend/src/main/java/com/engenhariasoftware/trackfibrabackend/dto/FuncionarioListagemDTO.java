package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FuncionarioListagemDTO {
    private Long id;
    private String nome;
    private String email;
    private String numeroTelefone;
    private StatusFuncionario statusFuncionario;
}
