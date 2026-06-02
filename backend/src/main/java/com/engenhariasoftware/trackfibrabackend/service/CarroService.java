package com.engenhariasoftware.trackfibrabackend.service;


import com.engenhariasoftware.trackfibrabackend.dto.CarroRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.CarroResponseDTO;
import com.engenhariasoftware.trackfibrabackend.model.Carro;
import com.engenhariasoftware.trackfibrabackend.repository.CarroRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CarroService {

    private final CarroRepository carroRepository;

    public CarroService(CarroRepository carroRepository) {
        this.carroRepository = carroRepository;
    }

    public CarroResponseDTO cadastrar(CarroRequestDTO dto) {
        if (carroRepository.existsByPlaca(dto.placa())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Placa já cadastrada");
        }

        Carro carro = new Carro();
        carro.setPlaca(dto.placa());
        carro.setModelo(dto.modelo());
        carro.setMarca(dto.marca());
        carro.setAno(dto.ano());

        Carro carroSalvo = carroRepository.save(carro);

        return new CarroResponseDTO(
                carroSalvo.getId(),
                carroSalvo.getPlaca(),
                carroSalvo.getModelo(),
                carroSalvo.getMarca(),
                carroSalvo.getAno(),
                carroSalvo.getStatus()
        );
    }
}
