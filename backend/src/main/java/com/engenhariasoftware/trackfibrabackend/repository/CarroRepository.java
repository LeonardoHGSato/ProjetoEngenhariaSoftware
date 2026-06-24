package com.engenhariasoftware.trackfibrabackend.repository;

import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.model.Carro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarroRepository extends JpaRepository<Carro, Long> {

    boolean existsByPlaca(String placa);

    Page<Carro> findByStatus(StatusCarro status, Pageable pageable);
    Page<Carro> findByStatusNot(StatusCarro status, Pageable pageable);

    long countByStatus(StatusCarro status);
}
