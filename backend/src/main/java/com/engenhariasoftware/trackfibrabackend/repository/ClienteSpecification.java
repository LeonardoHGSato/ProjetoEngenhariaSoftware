package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.model.Cliente;
import org.springframework.data.jpa.domain.Specification;

public class ClienteSpecification {
    public static Specification<Cliente> comBusca(String busca){
        return (root, query, cb) -> {
            if (busca == null || busca.isBlank()){
            }

            String apenasNumeros = busca.replaceAll("\\D", "");

            // Se o usuário digitou apenas letras (nome), o "apenasNumeros" ficará vazio.
            if (apenasNumeros.isEmpty()) {
                return cb.like(cb.lower(root.get("nome")), "%" + busca.toLowerCase() + "%");
            }

            // Se tiver números, busca tanto no nome quanto no CPF/CNPJ
            return cb.or(
                    cb.like(cb.lower(root.get("nome")), "%" + busca.toLowerCase() + "%"),
                    cb.like(root.get("cpfCnpj"), "%" + apenasNumeros + "%")
            );
        };
    }
}


