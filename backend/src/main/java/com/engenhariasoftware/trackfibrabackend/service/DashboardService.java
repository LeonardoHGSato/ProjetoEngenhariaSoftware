package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.CarrosPorStatusDTO;
import com.engenhariasoftware.trackfibrabackend.dto.ChamadaListagemDTO;
import com.engenhariasoftware.trackfibrabackend.dto.DashboardResumoDTO;
import com.engenhariasoftware.trackfibrabackend.dto.UltimaChamadaDTO;
import com.engenhariasoftware.trackfibrabackend.enums.PerfilFuncionario;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.repository.CarroRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaStatusLogRepository;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ChamadaRepository chamadaRepository;
    private final CarroRepository carroRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final ChamadaStatusLogRepository logRepository;

    public DashboardService(ChamadaRepository chamadaRepository,
                            CarroRepository carroRepository,
                            FuncionarioRepository funcionarioRepository,
                            ChamadaStatusLogRepository logRepository) {
        this.chamadaRepository = chamadaRepository;
        this.carroRepository = carroRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.logRepository = logRepository;
    }

    public DashboardResumoDTO buscarResumo(FuncionarioModel usuarioLogado) {
        if (usuarioLogado.getPerfilFuncionario() == PerfilFuncionario.TECNICO) {
            long minhasChamadasAbertas = chamadaRepository.countByFuncionarioIdAndStatus(usuarioLogado.getId(), StatusChamada.ABERTA);

            List<ChamadaListagemDTO> minhasChamadas = chamadaRepository
                    .findByFuncionarioIdAndStatusOrderByDataHoraDesc(usuarioLogado.getId(), StatusChamada.ABERTA)
                    .stream()
                    .map(ChamadaListagemDTO::new)
                    .toList();

            return new DashboardResumoDTO(null, null, null, null, null, minhasChamadasAbertas, minhasChamadas);
        }

        long chamadasAbertas = chamadaRepository.countByStatus(StatusChamada.ABERTA);
        long carrosDisponiveis = carroRepository.countByStatus(StatusCarro.DISPONIVEL);
        long tecnicosAtivos = funcionarioRepository.countByStatusFuncionarioAndPerfilFuncionario(StatusFuncionario.ATIVO, PerfilFuncionario.TECNICO);

        CarrosPorStatusDTO carrosPorStatus = new CarrosPorStatusDTO(
                carrosDisponiveis,
                carroRepository.countByStatus(StatusCarro.EM_USO),
                carroRepository.countByStatus(StatusCarro.MANUTENCAO)
        );

        List<UltimaChamadaDTO> ultimasChamadas = logRepository.findTop10ByOrderByAlteradoEmDesc()
                .stream()
                .map(UltimaChamadaDTO::new)
                .toList();

        return new DashboardResumoDTO(chamadasAbertas, carrosDisponiveis, tecnicosAtivos, carrosPorStatus, ultimasChamadas, null, null);
    }
}