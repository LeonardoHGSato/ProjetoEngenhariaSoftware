package com.engenhariasoftware.trackfibrabackend.config;

import com.engenhariasoftware.trackfibrabackend.exception.ConflitoException;
import com.engenhariasoftware.trackfibrabackend.exception.RecursoNaoEncontradoException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

//Passa pro spring que a classe interceta excecoes dos controllers
@RestControllerAdvice
public class GlobalExceptionHandler {
    /*
     * Agora, qualquer erro lançado sem usar alguma classe específica (ConflitoException ou RecursoNaoEncontradoException) vira um 500.
     * Isso significa que precisamos lembrar de fazer o tratamento específico para erros relevantes no futuro.
     * */

    // 404 para id inexistente
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<String> handleNaoEncontrado(RecursoNaoEncontradoException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 409 para conflito de duplicidade (cpf ou email duplicado, no caso)
    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<String> handleConflito(ConflitoException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // Mantido para compatibilidade com o Login
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<String> handleBusinesException(BusinessException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // 400 para erros de validacao
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidacao(MethodArgumentNotValidException ex){
        Map<String, String> erros = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(e -> erros.put(e.getField(), e.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros);
    }

    // 401 para erro de login
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Credenciais inválidas. Verifique seu e-mail e senha.");
    }

    // 403 para usuario desativado tentando logar
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<String> handleDisabledUsers(DisabledException ex){
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Usuário inativo. Acesso negado.");
    }

    // 500 para erros internos inesperados
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeral(Exception ex){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno no servidor.");
    }
}