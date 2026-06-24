package com.engenhariasoftware.trackfibrabackend.model;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "chamada_status_log")
public class ChamadaStatusLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chamada_id", nullable = false)
    private Chamada chamada;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusChamada status;

    @Column(name = "alterado_em", nullable = false)
    private LocalDateTime alteradoEm;

    public ChamadaStatusLog(Chamada chamada){
        this.chamada = chamada;
        this.status = chamada.getStatus();
        this.alteradoEm = LocalDateTime.now();
    }
}
