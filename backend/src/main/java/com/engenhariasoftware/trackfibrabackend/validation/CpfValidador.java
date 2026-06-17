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
        try {
            CPFValidator validator = new CPFValidator();
            validator.assertValid(cpf);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
