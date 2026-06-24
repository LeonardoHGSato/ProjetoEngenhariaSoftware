package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.dto.*;
import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.service.ChamadaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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

    @GetMapping("/{id}")
    public ResponseEntity<ChamadaResponseDTO> buscarPorId(@PathVariable Long id, @AuthenticationPrincipal FuncionarioModel usuarioLogado){
        return ResponseEntity.ok(chamadaService.buscarPorId(id, usuarioLogado));
    }

    @GetMapping
    public ResponseEntity<Page<ChamadaListagemDTO>> listarChamadas(
            @RequestParam(required = false) StatusChamada status,
            @RequestParam(required = false) TipoServico tipoServico,
            @RequestParam(required = false) Long funcionarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @AuthenticationPrincipal FuncionarioModel usuarioLogado,
            Pageable pageable) {

        Page<ChamadaListagemDTO> chamadas = chamadaService.listarChamadas(
                status, tipoServico, funcionarioId, inicio, fim, usuarioLogado, pageable);

        return ResponseEntity.ok(chamadas);
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<ChamadaResponseDTO> finalzarChamada(@PathVariable Long id, @RequestParam @Valid ChamadaFinalizarDTO dto, @AuthenticationPrincipal FuncionarioModel usuarioLogado){
        return ResponseEntity.ok(chamadaService.finalizarChamada(id, dto, usuarioLogado));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ChamadaResponseDTO> cancelarChamada(@PathVariable Long id, @RequestBody @Valid ChamadaCancelarDTO dto){
        return ResponseEntity.ok(chamadaService.cancelarChamada(id, dto));
    }
}
