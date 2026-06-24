package com.engenhariasoftware.trackfibrabackend.controller;


import com.engenhariasoftware.trackfibrabackend.dto.*;
import com.engenhariasoftware.trackfibrabackend.model.Chamada;
import com.engenhariasoftware.trackfibrabackend.service.ChamadaService;
import com.engenhariasoftware.trackfibrabackend.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final ChamadaService chamadaService;

    public ClienteController(ClienteService clienteService, ChamadaService chamadaService) {
        this.clienteService = clienteService;
        this.chamadaService = chamadaService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> cadastrarCliente(@RequestBody @Valid ClienteRequestDTO requestDTO) {
        ClienteResponseDTO responseDTO = clienteService.cadastrarCliente(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<Page<ClienteListagemDTO>> listarClientes(@RequestParam(required = false) String busca, Pageable pageable) {
        return ResponseEntity.ok(clienteService.listarClientes(busca, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarCliente(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> editarCliente(@PathVariable Long id, @RequestBody @Valid ClienteEdicaoDTO edicaoDTO) {
        return ResponseEntity.ok(clienteService.editarCliente(id, edicaoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativarCliente(@PathVariable Long id) {
        clienteService.desativarCliente(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<Page<ChamadaHistoricoDTO>> historicoCliente(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            Pageable pageable) {
        return ResponseEntity.ok(chamadaService.historicoCliente(id, inicio, fim, pageable));
    }
}
