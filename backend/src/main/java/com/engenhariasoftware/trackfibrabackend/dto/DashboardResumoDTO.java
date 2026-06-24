package com.engenhariasoftware.trackfibrabackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record DashboardResumoDTO(
        // Campos do Supervisor
        Long chamadasAbertas,
        Long carrosDisponiveis,
        Long tecnicosAtivos,
        CarrosPorStatusDTO carrosPorStatus,
        List<UltimaChamadaDTO> ultimasChamadas,

        // Campos do Técnico
        Long minhasChamadasAbertas,
        List<ChamadaListagemDTO> minhasChamadas
) {
    public static DashboardResumoDTO paraSupervisor(
            long chamadasAbertas,
            long carrosDisponiveis,
            long tecnicosAtivos,
            CarrosPorStatusDTO carrosPorStatus,
            List<UltimaChamadaDTO> ultimasChamadas) {
        return new DashboardResumoDTO(
                chamadasAbertas, carrosDisponiveis, tecnicosAtivos,
                carrosPorStatus, ultimasChamadas,
                null, null);
    }

    public static DashboardResumoDTO paraTecnico(
            long minhasChamadasAbertas,
            List<ChamadaListagemDTO> minhasChamadas) {
        return new DashboardResumoDTO(
                null, null, null, null, null,
                minhasChamadasAbertas, minhasChamadas);
    }
}
