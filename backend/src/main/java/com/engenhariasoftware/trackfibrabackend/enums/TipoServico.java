package com.engenhariasoftware.trackfibrabackend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum TipoServico {

    INSTALACAO("Instalação", "Instalação de fibra óptica", 90),
    MANUTENCAO("Manutenção", "Manutenção e reparo da conexão", 60),
    RECOLHER_EQUIPAMENTO("Recolher Equipamento", "Cancelamento e retirada do equipamento", 30);

    private final String id;
    private final String nome;
    private final String descricao;
    private final Integer tempoMedioMinutos;

    TipoServico(String nome, String descricao, Integer tempoMedioMinutos){
        this.id = this.name();
        this.nome = nome;
        this.descricao = descricao;
        this.tempoMedioMinutos = tempoMedioMinutos;
    }

    public String getId(){
        return id;
    }
    public String getNome(){
        return nome;
    }
    public String getDescricao(){
        return descricao;
    }
    public Integer getTempoMedioMinutos(){
        return tempoMedioMinutos;
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static TipoServico fromId(String id) {
        if (id == null) {
            return null;
        }
        return TipoServico.valueOf(id.trim().toUpperCase());
    }
}
