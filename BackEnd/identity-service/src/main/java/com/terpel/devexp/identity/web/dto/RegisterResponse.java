package com.terpel.devexp.identity.web.dto;

import java.util.UUID;

/**
 * Register creates the account but does not issue a JWT.
 * Client must call /api/auth/login to obtain a Bearer token.
 */
public record RegisterResponse(
        UUID userId,
        String alias,
        String message
) {}
