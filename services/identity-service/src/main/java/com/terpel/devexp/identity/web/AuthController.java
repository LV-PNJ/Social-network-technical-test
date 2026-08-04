package com.terpel.devexp.identity.web;

import com.terpel.devexp.identity.service.IdentityService;
import com.terpel.devexp.identity.web.dto.AuthResponse;
import com.terpel.devexp.identity.web.dto.LoginRequest;
import com.terpel.devexp.identity.web.dto.RegisterRequest;
import com.terpel.devexp.identity.web.dto.RegisterResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth")
public class AuthController {

    private final IdentityService identityService;

    public AuthController(IdentityService identityService) {
        this.identityService = identityService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar usuario (sin JWT; luego debe hacer login)")
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
        return identityService.register(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Login con alias o email — emite JWT RS256")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return identityService.login(request);
    }
}
