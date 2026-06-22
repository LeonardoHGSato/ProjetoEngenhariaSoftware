package com.engenhariasoftware.trackfibrabackend.controller;


import com.engenhariasoftware.trackfibrabackend.dto.ClienteEdicaoDTO;
import com.engenhariasoftware.trackfibrabackend.dto.ClienteListagemDTO;
import com.engenhariasoftware.trackfibrabackend.dto.ClienteRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.ClienteResponseDTO;
import com.engenhariasoftware.trackfibrabackend.model.Cliente;
import com.engenhariasoftware.trackfibrabackend.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService){
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> cadastrarCliente(@RequestBody @Valid ClienteRequestDTO requestDTO){
        ClienteResponseDTO responseDTO = clienteService.cadastrarCliente(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<Page<ClienteListagemDTO>> listarClientes(@RequestParam(required = false) String busca, Pageable pageable) {
        return ResponseEntity.ok(clienteService.listarClientes(busca, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> editarCliente(@PathVariable Long id, @RequestBody @Valid ClienteEdicaoDTO edicaoDTO){
        return ResponseEntity.ok(clienteService.editarCliente(id, edicaoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> desativarCliente(@PathVariable Long id){
        return ResponseEntity.ok(clienteService.desativarCliente(id));
    }
}
