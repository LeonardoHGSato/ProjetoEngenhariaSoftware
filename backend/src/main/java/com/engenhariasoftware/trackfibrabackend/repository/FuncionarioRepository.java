package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import org.springframework.data.jpa.repository.JpaRepository;

//O extends diz, basicamente, que o repositorio trabalha com a entidade FuncionarioModel e o tipo do ID dela é Long
public interface FuncionarioRepository extends JpaRepository<FuncionarioModel, Long> {
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
//Roda um SELECT EXISTS usando o nome passado para se referenciar a uma coluna com o msm nome (Ex: Cpf -> cpf)
}
