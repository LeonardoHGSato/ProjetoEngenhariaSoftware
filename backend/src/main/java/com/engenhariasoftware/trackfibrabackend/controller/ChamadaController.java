package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.dto.ChamadaRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.ChamadaResponseDTO;
import com.engenhariasoftware.trackfibrabackend.service.ChamadaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chamadas")
public class ChamadaController {

    private final ChamadaService chamadaService;

    public ChamadaController(ChamadaService chamadaService) {
        this.chamadaService = chamadaService;
    }

    @PostMapping
    public ResponseEntity<ChamadaResponseDTO> abrirChamada(@RequestBody @Valid ChamadaRequestDTO dto) {
        ChamadaResponseDTO response = chamadaService.abrirChamada(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
