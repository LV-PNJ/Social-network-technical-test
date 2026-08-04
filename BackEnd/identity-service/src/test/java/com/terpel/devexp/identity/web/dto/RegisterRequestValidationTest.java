package com.terpel.devexp.identity.web.dto;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.time.LocalDate;
import java.util.Set;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class RegisterRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void init() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void acceptsValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest(
                "candidate1",
                "candidate1@example.com",
                "Secret123!",
                "Ana",
                "Perez",
                LocalDate.of(1998, 5, 20)
        );
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty());
    }

    @Test
    void rejectsInvalidAliasEmailPasswordAndFutureBirthDate() {
        RegisterRequest request = new RegisterRequest(
                "ab",
                "bad",
                "123",
                "",
                "",
                LocalDate.of(2099, 1, 1)
        );
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> "alias".equals(v.getPropertyPath().toString())));
        assertTrue(violations.stream().anyMatch(v -> "email".equals(v.getPropertyPath().toString())));
        assertTrue(violations.stream().anyMatch(v -> "password".equals(v.getPropertyPath().toString())));
        assertTrue(violations.stream().anyMatch(v -> "birthDate".equals(v.getPropertyPath().toString())));
    }

    @Test
    void loginRequiresUserAndPassword() {
        Set<ConstraintViolation<LoginRequest>> violations =
                validator.validate(new LoginRequest("", ""));
        assertFalse(violations.isEmpty());
    }
}
