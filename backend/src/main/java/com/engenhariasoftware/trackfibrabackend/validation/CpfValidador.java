package com.engenhariasoftware.trackfibrabackend.validation;

import br.com.caelum.stella.validation.CPFValidator;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfValidador implements ConstraintValidator<CpfValido, String> {
    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        if (cpf == null || cpf.isBlank()) {
            return false;
        }
//        valida o cpf usando os digitos verificadores
        try {
            CPFValidator validator = new CPFValidator();
            validator.assertValid(cpf);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
