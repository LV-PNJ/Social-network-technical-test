package com.terpel.devexp.identity.web;

import com.terpel.devexp.identity.service.IdentityService;
import com.terpel.devexp.identity.web.dto.ProfileResponse;
import com.terpel.devexp.identity.web.dto.UpdateProfileRequest;
import com.terpel.devexp.identity.web.error.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profiles")
@Tag(name = "Profiles")
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {

    private final IdentityService identityService;

    public ProfileController(IdentityService identityService) {
        this.identityService = identityService;
    }

    @GetMapping("/me")
    @Operation(summary = "Perfil del usuario autenticado")
    public ProfileResponse me(Authentication authentication) {
        return identityService.getProfile(currentUserId(authentication));
    }

    @PutMapping("/me")
    @Operation(summary = "Actualizar nombres, apellidos o fecha de nacimiento")
    public ProfileResponse updateMe(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return identityService.updateProfile(currentUserId(authentication), request);
    }

    @GetMapping("/{alias}")
    @Operation(summary = "Consultar perfil por alias")
    public ProfileResponse byAlias(@PathVariable String alias) {
        return identityService.getProfileByAlias(alias);
    }

    private UUID currentUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Token requerido");
        }
        try {
            return UUID.fromString(authentication.getPrincipal().toString());
        } catch (IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Token inválido");
        }
    }
}
