package com.terpel.devexp.identity.web.error;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.terpel.devexp.identity.web.dto.ApiError;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void mapsApiExceptionToContract() {
        ApiException ex = new ApiException(HttpStatus.CONFLICT, "ALIAS_EXISTS", "El alias ya está en uso");
        ResponseEntity<ApiError> response = handler.handleApi(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        ApiError body = response.getBody();
        assertEquals(409, body.status());
        assertEquals("ALIAS_EXISTS", body.code());
        assertEquals("El alias ya está en uso", body.message());
        assertTrue(body.details() == null || body.details().isEmpty() || body.details().equals(List.of()));
        assertTrue(body.correlationId() != null && !body.correlationId().isBlank());
    }
}
