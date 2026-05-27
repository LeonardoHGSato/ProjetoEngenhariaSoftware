package com.engenhariasoftware.trackfibrabackend.model;

import com.engenhariasoftware.trackfibrabackend.enums.PerfilFuncionario;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Construtores, Setters e Getters com lombok
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

//Entidade jpa
@Entity
@Table (name = "funcionarios")
public class FuncionarioModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //somente para o banco de dados

    @Column(nullable = false)
    private String nome;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String numeroTelefone; //ou somente numeros?
    @Column(unique = true, nullable = false)
    private String cpf; //ou somente os numeros tambem?

    @Column(nullable = false)
    private StatusFuncionario statusFuncionario;
    @Column(nullable = false)
    private PerfilFuncionario perfilFuncionario;
}