package com.terpel.devexp.identity.web.dto;

import java.util.UUID;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresInMs,
        UUID userId,
        String alias
) {}
