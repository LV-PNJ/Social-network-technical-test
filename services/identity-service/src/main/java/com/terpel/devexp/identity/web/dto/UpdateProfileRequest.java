package com.terpel.devexp.identity.web.dto;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UpdateProfileRequest(
        @Size(max = 80) String firstName,
        @Size(max = 80) String lastName,
        @Past LocalDate birthDate
) {}
