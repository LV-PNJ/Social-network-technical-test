package com.terpel.devexp.identity.web.error;

import com.terpel.devexp.identity.web.CorrelationIdFilter;
import com.terpel.devexp.identity.web.dto.ApiError;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiError> handleApi(ApiException ex) {
        return build(ex.getStatus(), ex.getCode(), ex.getMessage(), List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        List<ApiError.FieldErrorDetail> details = ex.getBindingResult().getFieldErrors().stream()
                .map(this::toDetail)
                .toList();
        return build(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "La solicitud contiene datos inválidos", details);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadable(
            org.springframework.http.converter.HttpMessageNotReadableException ex
    ) {
        return build(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "La solicitud contiene datos inválidos o el body es requerido",
                List.of()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class)
                .error("Unhandled error", ex);
        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "Ocurrió un error interno",
                List.of()
        );
    }

    private ApiError.FieldErrorDetail toDetail(FieldError error) {
        String reason = error.getDefaultMessage() != null ? error.getDefaultMessage() : "inválido";
        return new ApiError.FieldErrorDetail(error.getField(), reason);
    }

    private ResponseEntity<ApiError> build(
            HttpStatus status,
            String code,
            String message,
            List<ApiError.FieldErrorDetail> details
    ) {
        ApiError body = new ApiError(
                Instant.now(),
                status.value(),
                code,
                message,
                details,
                CorrelationIdFilter.current()
        );
        return ResponseEntity.status(status).body(body);
    }
}
