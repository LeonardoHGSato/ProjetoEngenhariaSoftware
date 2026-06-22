package com.engenhariasoftware.trackfibrabackend;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ExemploTest extends BaseTest {

    @Test
    @DisplayName("Deve passar como exemplo para validar a infraestrutura de testes")
    void devePassarTesteExemplo(){
        int resultado = 2 + 2;
        Assertions.assertEquals(4, resultado, "A conta falhou.");
    }
}
