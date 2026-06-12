package com.engenhariasoftware.trackfibrabackend.config;

public class BusinessException extends RuntimeException{
    public BusinessException(String mensagem){
        super(mensagem);
    }
}
