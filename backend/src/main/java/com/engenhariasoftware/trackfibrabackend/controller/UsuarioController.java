package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.dto.AlterarSenhaDTO;
import com.engenhariasoftware.trackfibrabackend.dto.UsuarioEdicaoDTO;
import com.engenhariasoftware.trackfibrabackend.dto.UsuarioPerfilDTO;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioPerfilDTO> buscarPerfil(@AuthenticationPrincipal FuncionarioModel usuarioLogado) {
        return ResponseEntity.ok(usuarioService.buscarPerfil(usuarioLogado));
    }

    @PatchMapping("/me")
    public ResponseEntity<UsuarioPerfilDTO> editarPerfil(
            @AuthenticationPrincipal FuncionarioModel usuarioLogado,
            @RequestBody @Valid UsuarioEdicaoDTO dto) {
        return ResponseEntity.ok(usuarioService.editarPerfil(usuarioLogado, dto));
    }

    @PatchMapping("/me/senha")
    public ResponseEntity<Void> alterarSenha(
            @AuthenticationPrincipal FuncionarioModel usuarioLogado,
            @RequestBody @Valid AlterarSenhaDTO dto) {
        usuarioService.alterarSenha(usuarioLogado, dto);
        return ResponseEntity.noContent().build();
    }
}
