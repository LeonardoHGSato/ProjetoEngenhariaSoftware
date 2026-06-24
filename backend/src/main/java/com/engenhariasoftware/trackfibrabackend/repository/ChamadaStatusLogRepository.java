package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.model.ChamadaStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChamadaStatusLogRepository extends JpaRepository<ChamadaStatusLog, Long> {
}
