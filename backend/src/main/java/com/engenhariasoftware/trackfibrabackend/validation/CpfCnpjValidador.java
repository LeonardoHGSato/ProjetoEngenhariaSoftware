package com.engenhariasoftware.trackfibrabackend.validation;

import br.com.caelum.stella.validation.CNPJValidator;
import br.com.caelum.stella.validation.CPFValidator;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfCnpjValidador implements ConstraintValidator<CpfCnpjValido, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) return false;

        String apenasNumeros = value.replaceAll("[^0-9]", "");

        try {
            if (apenasNumeros.length() == 11) {
                new CPFValidator().assertValid(apenasNumeros);
                return true;
            } else if (apenasNumeros.length() == 14) {
                new CNPJValidator().assertValid(apenasNumeros);
                return true;
            }
        } catch (Exception e) {
            return false;
        }

        return false;
    }
}
