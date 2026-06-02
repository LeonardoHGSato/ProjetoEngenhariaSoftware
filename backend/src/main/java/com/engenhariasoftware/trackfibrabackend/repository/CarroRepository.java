package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.model.Carro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarroRepository extends JpaRepository<Carro, Long> {

    boolean existsByPlaca(String placa);
}
