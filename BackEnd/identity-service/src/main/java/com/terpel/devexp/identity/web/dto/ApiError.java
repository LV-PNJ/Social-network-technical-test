package com.terpel.devexp.identity.web.dto;

import java.time.Instant;
import java.util.List;

public record ApiError(
        Instant timestamp,
        int status,
        String code,
        String message,
        List<FieldErrorDetail> details,
        String correlationId
) {
    public record FieldErrorDetail(String field, String reason) {}
}
