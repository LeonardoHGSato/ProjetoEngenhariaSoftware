package com.engenhariasoftware.trackfibrabackend.dto;

public record CarrosPorStatusDTO(
        Long disponiveis,
        Long emUso,
        Long emManutencao
){}
