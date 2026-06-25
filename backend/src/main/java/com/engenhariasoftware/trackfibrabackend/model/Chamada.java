package com.engenhariasoftware.trackfibrabackend.model;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter

@Entity
@Table(name = "chamadas")
public class Chamada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteModel cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_id", nullable = false)
    private FuncionarioModel funcionario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carro_id", nullable = false)
    private Carro carro;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_servico", nullable = false, length = 50)
    private TipoServico tipoServico;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusChamada status = StatusChamada.ABERTA;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(columnDefinition = "TEXT")
    private String relato;

    @Column(name = "motivo_cancelamento")
    private String motivoCancelamento;

    @Embedded
    private Endereco endereco;
}
