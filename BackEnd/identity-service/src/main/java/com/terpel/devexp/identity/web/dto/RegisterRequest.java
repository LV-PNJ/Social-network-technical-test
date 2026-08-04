package com.terpel.devexp.identity.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 30)
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "solo letras, números y guion bajo")
        String alias,

        @NotBlank @Email @Size(max = 100)
        String email,

        @NotBlank @Size(min = 6, max = 100)
        String password,

        @NotBlank @Size(max = 80)
        String firstName,

        @NotBlank @Size(max = 80)
        String lastName,

        @NotNull @Past
        LocalDate birthDate
) {}
