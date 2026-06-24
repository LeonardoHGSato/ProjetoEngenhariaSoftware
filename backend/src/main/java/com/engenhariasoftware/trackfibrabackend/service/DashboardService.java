package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.DashboardResumoDTO;
import com.engenhariasoftware.trackfibrabackend.enums.PerfilFuncionario;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.repository.CarroRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaRepository;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ChamadaRepository chamadaRepository;
    private final CarroRepository carroRepository;
    private final FuncionarioRepository funcionarioRepository;

    public DashboardService(ChamadaRepository chamadaRepository,
                            CarroRepository carroRepository,
                            FuncionarioRepository funcionarioRepository) {
        this.chamadaRepository = chamadaRepository;
        this.carroRepository = carroRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public DashboardResumoDTO buscarResumo(FuncionarioModel usuarioLogado) {
        // Se for Técnico, retorna imediatamente apenas as suas chamadas abertas
        if (usuarioLogado.getPerfilFuncionario() == PerfilFuncionario.TECNICO) {
            long minhasChamadasAbertas = chamadaRepository
                    .countByFuncionarioIdAndStatus(usuarioLogado.getId(), StatusChamada.ABERTA);
            return new DashboardResumoDTO(minhasChamadasAbertas, null, null);
        }

        // Visão do Supervisor (Contagens Globais)
        long chamadasAbertas = chamadaRepository.countByStatus(StatusChamada.ABERTA);
        long carrosDisponiveis = carroRepository.countByStatus(StatusCarro.DISPONIVEL);
        long tecnicosAtivos = funcionarioRepository
                .countByStatusFuncionarioAndPerfilFuncionario(StatusFuncionario.ATIVO, PerfilFuncionario.TECNICO);

        return new DashboardResumoDTO(chamadasAbertas, carrosDisponiveis, tecnicosAtivos);
    }
}
