package com.terpel.devexp.identity.service;

import com.terpel.devexp.identity.domain.UserAccount;
import com.terpel.devexp.identity.repository.UserAccountRepository;
import com.terpel.devexp.identity.security.JwtService;
import com.terpel.devexp.identity.web.dto.AuthResponse;
import com.terpel.devexp.identity.web.dto.LoginRequest;
import com.terpel.devexp.identity.web.dto.ProfileResponse;
import com.terpel.devexp.identity.web.dto.RegisterRequest;
import com.terpel.devexp.identity.web.dto.UpdateProfileRequest;
import com.terpel.devexp.identity.web.error.ApiException;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdentityService {

    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public IdentityService(
            UserAccountRepository users,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (users.existsByAlias(request.alias())) {
            throw new ApiException(HttpStatus.CONFLICT, "ALIAS_EXISTS", "El alias ya está en uso");
        }
        if (users.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "EMAIL_EXISTS", "El email ya está en uso");
        }

        UserAccount user = new UserAccount();
        user.setAlias(request.alias());
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setBirthDate(request.birthDate());
        users.save(user);

        return toAuth(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserAccount user = users.findByAlias(request.user())
                .or(() -> users.findByEmail(request.user().toLowerCase()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Credenciales inválidas"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Credenciales inválidas");
        }
        return toAuth(user);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        return toProfile(requireUser(userId));
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByAlias(String alias) {
        UserAccount user = users.findByAlias(alias)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROFILE_NOT_FOUND", "Perfil no encontrado"));
        return toProfile(user);
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        UserAccount user = requireUser(userId);
        if (request.firstName() != null && !request.firstName().isBlank()) {
            user.setFirstName(request.firstName());
        }
        if (request.lastName() != null && !request.lastName().isBlank()) {
            user.setLastName(request.lastName());
        }
        if (request.birthDate() != null) {
            user.setBirthDate(request.birthDate());
        }
        return toProfile(user);
    }

    private UserAccount requireUser(UUID userId) {
        return users.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROFILE_NOT_FOUND", "Perfil no encontrado"));
    }

    private AuthResponse toAuth(UserAccount user) {
        String token = jwtService.issueToken(user.getId(), user.getAlias());
        return new AuthResponse(token, "Bearer", jwtService.getExpirationMs(), user.getId(), user.getAlias());
    }

    private ProfileResponse toProfile(UserAccount user) {
        return new ProfileResponse(
                user.getId(),
                user.getAlias(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getBirthDate()
        );
    }
}
