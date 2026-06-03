package com.engenhariasoftware.trackfibrabackend.service;


import com.engenhariasoftware.trackfibrabackend.dto.CarroRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.CarroResponseDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.model.Carro;
import com.engenhariasoftware.trackfibrabackend.repository.CarroRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

        int anoAtual = java.time.Year.now().getValue();
        if (dto.ano() > anoAtual) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ano do carro não pode ser no futuro");
        }
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

    public Page<CarroResponseDTO> listar(StatusCarro status, Pageable pageable){
        Page<Carro> paginaDeCarros;

        if(status != null){
            paginaDeCarros = carroRepository.findByStatus(status, pageable);
        } else {
            paginaDeCarros = carroRepository.findByStatusNot(StatusCarro.DESATIVADO, pageable);
        }

        return paginaDeCarros.map(carro -> new CarroResponseDTO(
                carro.getId(),
                carro.getPlaca(),
                carro.getModelo(),
                carro.getMarca(),
                carro.getAno(),
                carro.getStatus()
        ));
    }

    public CarroResponseDTO buscarPorId(Long id){

        Carro carro = carroRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carro não encontrado"));
        return new CarroResponseDTO(
                carro.getId(),
                carro.getPlaca(),
                carro.getModelo(),
                carro.getMarca(),
                carro.getAno(),
                carro.getStatus()
        );
    }
}
