package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.model.ChamadaStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChamadaStatusLogRepository extends JpaRepository<ChamadaStatusLog, Long> {

    List<ChamadaStatusLog> findTop10ByOrderByAlteradoEmDesc();
}
