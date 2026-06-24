package com.engenhariasoftware.trackfibrabackend.listener;

import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import com.engenhariasoftware.trackfibrabackend.model.ChamadaStatusLog;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaStatusLogRepository;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostUpdate;
import org.springframework.stereotype.Component;

@Component
public class ChamadaStatusListener {
    private static ChamadaStatusLogRepository repository;

    public static void setRepository(ChamadaStatusLogRepository repo){
        repository = repo;
    }

    @PostPersist
    public void logCriacao(Chamada chamada) {
        repository.save(new ChamadaStatusLog(chamada));
    }

    @PostUpdate
    public void logAtualizacao(Chamada chamada) {
        repository.save(new ChamadaStatusLog(chamada));
    }
}
