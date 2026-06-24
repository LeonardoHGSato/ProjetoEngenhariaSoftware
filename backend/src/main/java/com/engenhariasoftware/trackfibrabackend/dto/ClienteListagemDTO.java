package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusCliente;
import com.engenhariasoftware.trackfibrabackend.model.ClienteModel;

public record ClienteListagemDTO(
        Long id,
        String nome,
        String cpfCnpj,
        String telefone,
        String cidade,
        StatusCliente status
){
    public ClienteListagemDTO(ClienteModel cliente) {
        this(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpfCnpj(),
                cliente.getTelefone(),
                cliente.getEndereco().getCidade(),
                cliente.getStatus()
        );
    }
}
