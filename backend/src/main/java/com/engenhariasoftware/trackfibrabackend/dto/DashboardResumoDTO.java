package com.engenhariasoftware.trackfibrabackend.dto;

public record DashboardResumoDTO(
        Long chamadasAbertas,
        Long carrosDisponiveis,
        Long tecnicosAtivos
) {}
