package com.engenhariasoftware.trackfibrabackend.dto;

import com.engenhariasoftware.trackfibrabackend.enums.StatusCliente;
import com.engenhariasoftware.trackfibrabackend.model.ClienteModel;

public record ClienteResponseDTO(
        Long id,
        String nome,
        String cpfCnpj,
        String telefone,
        String email,
        EnderecoDTO endereco,
        StatusCliente status
){
    public ClienteResponseDTO(ClienteModel cliente) {
        this(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpfCnpj(),
                cliente.getTelefone(),
                cliente.getEmail(),
                EnderecoDTO.fromEntity(cliente.getEndereco()),
                cliente.getStatus()
        );
    }
}