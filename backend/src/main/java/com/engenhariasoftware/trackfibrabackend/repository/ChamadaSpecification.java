package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class ChamadaSpecification {

    public static Specification<Chamada> comStatus(StatusChamada status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Chamada> comTipoServico(TipoServico tipoServico) {
        return (root, query, cb) -> tipoServico == null ? null : cb.equal(root.get("tipoServico"), tipoServico);
    }

    public static Specification<Chamada> comFuncionario(Long funcionarioId) {
        return (root, query, cb) -> funcionarioId == null ? null : cb.equal(root.get("funcionario").get("id"), funcionarioId);
    }

    public static Specification<Chamada> aPartirDe(LocalDateTime inicio) {
        return (root, query, cb) -> inicio == null ? null : cb.greaterThanOrEqualTo(root.get("dataHora"), inicio);
    }

    public static Specification<Chamada> ate(LocalDateTime fim) {
        return (root, query, cb) -> fim == null ? null : cb.lessThanOrEqualTo(root.get("dataHora"), fim);
    }
}
