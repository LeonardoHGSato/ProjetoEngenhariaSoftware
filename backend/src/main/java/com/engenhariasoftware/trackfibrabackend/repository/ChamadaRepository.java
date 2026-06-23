package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.time.LocalDateTime;
import java.util.List;

public interface ChamadaRepository extends JpaRepository<Chamada, Long>, JpaSpecificationExecutor<Chamada> {

    List<Chamada> findByFuncionarioIdAndStatusAndDataHoraBetween(
            Long funcionarioId,
            StatusChamada status,
            LocalDateTime inicio,
            LocalDateTime fim);

    boolean existsByCarroIdAndStatus(Long carroId, StatusChamada status);
    boolean existsByClienteIdAndStatus(Long clienteId, StatusChamada status);
    boolean existsByFuncionarioIdAndStatus(Long funcionarioId, StatusChamada status);
}
