package com.terpel.devexp.identity.web.dto;

import java.time.LocalDate;
import java.util.UUID;

public record ProfileResponse(
        UUID id,
        String alias,
        String email,
        String firstName,
        String lastName,
        LocalDate birthDate
) {}
