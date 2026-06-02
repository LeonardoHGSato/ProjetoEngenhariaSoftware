package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.dto.CarroRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.CarroResponseDTO;
import com.engenhariasoftware.trackfibrabackend.service.CarroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/carros")
public class CarroController {

    private final CarroService carroService;

    public CarroController(CarroService carroService){
        this.carroService = carroService;
    }

    @PostMapping
    public ResponseEntity<CarroResponseDTO> cadastrar(@RequestBody @Valid CarroRequestDTO dto){
        CarroResponseDTO recibo = carroService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(recibo);
    }
}
