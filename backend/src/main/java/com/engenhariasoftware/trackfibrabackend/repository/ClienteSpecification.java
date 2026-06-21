package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.model.Cliente;
import org.springframework.data.jpa.domain.Specification;

public class ClienteSpecification {
    public static Specification<Cliente> comBusca(String busca){
        return (root, query, cb) -> busca == null || busca.isBlank() ? null:
                cb.or(cb.like(cb.lower(root.get("nome")), "%" + busca.toLowerCase() + "%"),
                        cb.like(root.get("cpfCnpj"), "%" + busca.replaceAll("\\D", "") + "%"));
//        \\D remove pontuação
    }
}
