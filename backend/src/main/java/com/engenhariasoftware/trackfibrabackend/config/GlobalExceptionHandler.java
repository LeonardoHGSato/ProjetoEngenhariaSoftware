package com.engenhariasoftware.trackfibrabackend.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ResponseEntity;

//Passa pro spring que a classe intercepta excecoes dos controllers
@RestControllerAdvice
public class GlobalExceptionHandler {

//    Definie que o metodo trata RuntimeException
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
//        CONFLICT = codigo 409 HTTP e retorna com a messagem ja definida em FuncionarioService
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}