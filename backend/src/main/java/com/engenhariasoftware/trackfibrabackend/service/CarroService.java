package com.engenhariasoftware.trackfibrabackend.service;


import com.engenhariasoftware.trackfibrabackend.dto.CarroRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.CarroResponseDTO;
import com.engenhariasoftware.trackfibrabackend.dto.CarroUpdateDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.model.Carro;
import com.engenhariasoftware.trackfibrabackend.repository.CarroRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CarroService {

    private final CarroRepository carroRepository;
    private final ChamadaRepository chamadaRepository;

    public CarroService(CarroRepository carroRepository, ChamadaRepository chamadaRepository) {
        this.carroRepository = carroRepository;
        this.chamadaRepository = chamadaRepository;
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

    public CarroResponseDTO editar(Long id, CarroUpdateDTO dto){
        Carro carro = carroRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carro não encontrado"));
        int anoAtual = java.time.Year.now().getValue();
        if (dto.ano() > anoAtual) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ano do carro não pode ser no futuro");
        }

        if (dto.status() == StatusCarro.MANUTENCAO
                && chamadaRepository.existsByCarroIdAndStatus(id, StatusChamada.ABERTA)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Não é possível colocar em manutenção um carro com chamada em aberto.");
        }

        carro.setModelo(dto.modelo());
        carro.setMarca(dto.marca());
        carro.setAno(dto.ano());
        if(dto.status() != null) {
            carro.setStatus(dto.status());
        }

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

    public void remover(Long id){
        Carro carro = carroRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carro não encontrado"));

        if (chamadaRepository.existsByCarroIdAndStatus(id, StatusChamada.ABERTA)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Não é possível remover um carro com chamada em aberto.");
        }

        carro.setStatus(StatusCarro.DESATIVADO);
        carroRepository.save(carro);
    }
}
