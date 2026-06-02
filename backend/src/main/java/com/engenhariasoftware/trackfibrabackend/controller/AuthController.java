package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.dto.LoginRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.LoginResponseDTO;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {

        // 1. O Spring Security tenta autenticar e-mail e senha digitados
        // Se a senha estiver errada ou o usuário inativo (conforme sua regra isEnabled), dispara erro automaticamente
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );

        // 2. Recupera o usuário autenticado (que é o seu FuncionarioModel)
        FuncionarioModel funcionario = (FuncionarioModel) authentication.getPrincipal();

        // 3. Gera o token JWT incluindo a claim da role
        String token = jwtService.gerarToken(funcionario);

        // 4. Extrai a role formatada para enviar no corpo da resposta
        String role = funcionario.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("ROLE_FUNCIONARIO");

        // 5. Retorna { token, role, nome } com HTTP 200 Ok
        return ResponseEntity.ok(new LoginResponseDTO(token, role, funcionario.getNome()));
    }
}