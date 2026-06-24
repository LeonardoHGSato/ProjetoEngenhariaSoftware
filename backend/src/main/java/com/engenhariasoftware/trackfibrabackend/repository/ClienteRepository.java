package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.model.ClienteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ClienteRepository extends JpaRepository<ClienteModel, Long>, JpaSpecificationExecutor<ClienteModel> {
    boolean existsByCpfCnpj(String cpfCnpj);

}
