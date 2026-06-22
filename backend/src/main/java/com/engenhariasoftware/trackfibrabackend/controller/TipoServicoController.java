package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tipos-servico")
public class TipoServicoController {

    @GetMapping
    public ResponseEntity<List<TipoServico>> listarTiposServico(){
        List<TipoServico> tipos = Arrays.asList(TipoServico.values());
        return ResponseEntity.ok(tipos);
    }
}
