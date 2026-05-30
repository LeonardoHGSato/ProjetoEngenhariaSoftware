package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import jdk.jshell.Snippet;
import org.springframework.data.jpa.domain.Specification;

public class FuncionarioSpecification {

    public static Specification<FuncionarioModel> comNome(String nome){
        return(root, query, cb) -> nome == null ? null:
                cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%");
    }

    public static Specification<FuncionarioModel> comSatatus(StatusFuncionario status){
        return (root, query, cb) -> status == null ? null:
                cb.equal(root.get("statusFuncionario"), status);
    }
}
