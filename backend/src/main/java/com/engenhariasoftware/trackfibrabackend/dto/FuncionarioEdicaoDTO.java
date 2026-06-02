package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.PerfilFuncionario;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FuncionarioEdicaoDTO {
    private String nome;
    private String email;
//    Validacao de numero de telefone baseada no tamanho dele e se há apenas números
    @Pattern(regexp = "^\\d{11}$", message = "Telefone inválido. Use apenas números com DDD (11 dígitos)")
    private String numeroTelefone;
    private StatusFuncionario statusFuncionario;
    private PerfilFuncionario perfilFuncionario;
}
