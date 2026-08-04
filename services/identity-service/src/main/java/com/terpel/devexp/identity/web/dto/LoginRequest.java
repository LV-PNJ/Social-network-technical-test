package com.terpel.devexp.identity.web.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String user,
        @NotBlank String password
) {}
