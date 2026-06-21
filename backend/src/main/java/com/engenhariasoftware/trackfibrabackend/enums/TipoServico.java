package com.engenhariasoftware.trackfibrabackend.enums;

public enum TipoServico {

    INSTALACAO("Instalação", "Instalação de fibra óptica", 90),
    MANUTENCAO("Manutenção", "Manutenção e reparo da conexão", 60),
    RECOLHER_EQUIPAMENTO("Recolher Equipamento", "Cancelamento e retirada do equipamento", 30);

    private final String nome;
    private final String descricao;
    private final Integer tempoMedioMinutos;

    TipoServico(String nome, String descricao, Integer tempoMedioMinutos){
        this.nome = nome;
        this.descricao = descricao;
        this.tempoMedioMinutos = tempoMedioMinutos;
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
}
