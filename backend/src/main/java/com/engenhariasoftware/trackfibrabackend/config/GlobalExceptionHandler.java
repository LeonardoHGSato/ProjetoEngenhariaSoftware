package com.engenhariasoftware.trackfibrabackend.config;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ResponseEntity;

//Passa pro spring que a classe interceta excecoes dos controllers
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<String> handleBusinesException(BusinessException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Credenciais inválidas. Verifique seu e-mail e senha.");
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<String> handleDisabledUsers(DisabledException ex){
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Usuário inativo. Acesso negado.");
    }
}