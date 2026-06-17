package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

//O extends diz, basicamente, que o repositorio trabalha com a entidade FuncionarioModel e o tipo do ID dela é Long
//        O segundo adiciona um metodo no repository que aceita filtros dinamicos e paginacao
public interface FuncionarioRepository extends JpaRepository<FuncionarioModel, Long>, JpaSpecificationExecutor<FuncionarioModel> {
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
//Ambos rodam um SELECT EXISTS usando o nome passado para se referenciar a uma coluna com o msm nome (Ex: Cpf -> cpf)

//Confere se tem algum registro com esse email, mas com outro id
    boolean existsByEmailAndIdNot(String email, Long id);
}
