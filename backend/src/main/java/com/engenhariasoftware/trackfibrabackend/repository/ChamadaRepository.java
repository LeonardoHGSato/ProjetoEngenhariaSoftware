package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ChamadaRepository extends JpaRepository<Chamada, Long>, JpaSpecificationExecutor<Chamada> {

    List<Chamada> findByFuncionarioIdAndStatusAndDataHoraBetween(
            Long funcionarioId,
            StatusChamada status,
            LocalDateTime inicio,
            LocalDateTime fim);

    List<Chamada> findByCarroIdAndStatusAndDataHoraBetween(
            Long carroId,
            StatusChamada status,
            LocalDateTime inicio,
            LocalDateTime fim);

    Optional<Chamada> findFirstByFuncionarioIdAndStatusOrderByDataHoraDesc(
            Long funcionarioId, StatusChamada status);

    boolean existsByCarroIdAndStatus(Long carroId, StatusChamada status);
    boolean existsByClienteIdAndStatus(Long clienteId, StatusChamada status);
    boolean existsByFuncionarioIdAndStatus(Long funcionarioId, StatusChamada status);

    Page<Chamada> findByClienteIdAndDataHoraBetween(Long clienteId, LocalDateTime inicio, LocalDateTime fim, Pageable pageable);

    Page<Chamada> findByFuncionarioIdAndDataHoraBetween(Long funcionarioId, LocalDateTime inicio, LocalDateTime fim, Pageable pageable);

    long countByStatus(StatusChamada status);
    long countByFuncionarioIdAndStatus(Long funcionarioId, StatusChamada status);

    List<Chamada> findByFuncionarioIdAndStatusOrderByDataHoraDesc(Long funcionarioId, StatusChamada status);
}
