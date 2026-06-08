package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.dto.CarroRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.CarroResponseDTO;
import com.engenhariasoftware.trackfibrabackend.dto.CarroUpdateDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.service.CarroService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carros")
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

    @GetMapping
    public ResponseEntity<Page<CarroResponseDTO>> listar(
            @RequestParam(required = false)StatusCarro status, Pageable pageable){
        return ResponseEntity.ok(carroService.listar(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarroResponseDTO> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(carroService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarroResponseDTO> editar(
            @PathVariable Long id,
            @RequestBody @Valid CarroUpdateDTO dto){

        return ResponseEntity.ok(carroService.editar(id, dto));
    }
}
