package com.engenhariasoftware.trackfibrabackend.config;

import com.engenhariasoftware.trackfibrabackend.listener.ChamadaStatusListener;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaStatusLogRepository;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ListenerConfig {
    public ListenerConfig(ChamadaStatusLogRepository chamadaStatusLogRepository){
        ChamadaStatusListener.setRepository(chamadaStatusLogRepository);
    }
}
