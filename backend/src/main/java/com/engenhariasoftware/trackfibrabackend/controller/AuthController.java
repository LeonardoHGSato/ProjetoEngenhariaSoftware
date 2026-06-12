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
        try {
            // O Spring Security tenta autenticar e-mail e senha digitados
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getSenha()
                    )
            );

            // Recupera o seu FuncionarioModel real
            FuncionarioModel funcionario = (FuncionarioModel) authentication.getPrincipal();

            // CRITÉRIO DE ACEITAÇÃO (Para o amigo do front): Força o estouro da exceção se estiver inativo
            if (!funcionario.isEnabled()) {
                throw new org.springframework.security.authentication.DisabledException("Usuário inativo. Acesso negado.");
            }

            // Gera o token JWT incluindo a claim da role
            String token = jwtService.gerarToken(funcionario);

            // Extrai a role formatada para enviar no corpo da resposta
            String role = funcionario.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority())
                    .orElse("ROLE_FUNCIONARIO");

            // Retorna { token, role, nome } com HTTP 200 Ok
            return ResponseEntity.ok(new LoginResponseDTO(token, role, funcionario.getNome()));

        } catch (org.springframework.security.core.AuthenticationException e) {
            // Se o erro já for de usuário inativo, repassa ele para o handler (403)
            if (e instanceof org.springframework.security.authentication.DisabledException) {
                throw e;
            }
            // Qualquer outra falha de autenticação (senha errada, email inexistente) vira BadCredentials (401)
            throw new org.springframework.security.authentication.BadCredentialsException("Credenciais inválidas. Verifique seu e-mail e senha.");
        }
    }
}