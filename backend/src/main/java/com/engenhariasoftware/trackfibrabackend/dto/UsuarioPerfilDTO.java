package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.PerfilFuncionario;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;

public record UsuarioPerfilDTO(
        Long id,
        String nome,
        String email,
        String cpf,
        String numeroTelefone,
        StatusFuncionario statusFuncionario,
        PerfilFuncionario perfilFuncionario
) {
    public UsuarioPerfilDTO(FuncionarioModel f) {
        this(
                f.getId(),
                f.getNome(),
                f.getEmail(),
                f.getCpf(),
                f.getNumeroTelefone(),
                f.getStatusFuncionario(),
                f.getPerfilFuncionario()
        );
    }
}
