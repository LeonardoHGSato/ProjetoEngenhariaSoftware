package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.validation.CpfValido;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    @NotBlank(message = "O nome é obrigatório.")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "O nome é obrigatório.")
    private String senha;
    //    Validacao de numero de telefone baseada no tamanho dele e se há apenas números
    @Pattern(regexp = "^\\d{11}$", message = "Telefone inválido. Use apenas números com DDD (11 dígitos)")
    private String numeroTelefone;
    @CpfValido
    private String cpf;
}
