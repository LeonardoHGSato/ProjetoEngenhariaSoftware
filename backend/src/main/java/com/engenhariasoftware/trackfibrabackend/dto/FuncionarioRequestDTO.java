package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.validation.CpfValido;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(regexp = "^\\d{11}$", message = "Telefone inválido. Use apenas números com DDD (11 dígitos)")
    private String numeroTelefone;
    @CpfValido
    private String cpf;
}
