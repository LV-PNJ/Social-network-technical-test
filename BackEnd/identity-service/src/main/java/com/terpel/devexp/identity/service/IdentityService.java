package com.terpel.devexp.identity.service;

import com.terpel.devexp.identity.domain.UserAccount;
import com.terpel.devexp.identity.repository.UserAccountRepository;
import com.terpel.devexp.identity.security.JwtService;
import com.terpel.devexp.identity.web.dto.AuthResponse;
import com.terpel.devexp.identity.web.dto.LoginRequest;
import com.terpel.devexp.identity.web.dto.ProfileResponse;
import com.terpel.devexp.identity.web.dto.RegisterRequest;
import com.terpel.devexp.identity.web.dto.RegisterResponse;
import com.terpel.devexp.identity.web.dto.UpdateProfileRequest;
import com.terpel.devexp.identity.web.error.ApiException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdentityService {

    private static final Logger log = LoggerFactory.getLogger(IdentityService.class);

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
    public RegisterResponse register(RegisterRequest request) {
        log.info("identity.register.attempt alias={} email={}", request.alias(), request.email());
        if (users.existsByAlias(request.alias())) {
            log.warn("identity.register.rejected reason=ALIAS_EXISTS alias={}", request.alias());
            throw new ApiException(HttpStatus.CONFLICT, "ALIAS_EXISTS", "El alias ya está en uso");
        }
        if (users.existsByEmail(request.email())) {
            log.warn("identity.register.rejected reason=EMAIL_EXISTS email={}", request.email());
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

        log.info("identity.register.ok userId={} alias={} jwtIssued=false", user.getId(), user.getAlias());
        return new RegisterResponse(
                user.getId(),
                user.getAlias(),
                "Usuario creado. Inicia sesión para obtener el token JWT."
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("identity.login.attempt user={}", request.user());
        UserAccount user = users.findByAlias(request.user())
                .or(() -> users.findByEmail(request.user().toLowerCase()))
                .orElseThrow(() -> {
                    log.warn("identity.login.failed reason=USER_NOT_FOUND user={}", request.user());
                    return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Credenciales inválidas");
                });

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            log.warn("identity.login.failed reason=BAD_PASSWORD userId={} alias={}", user.getId(), user.getAlias());
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Credenciales inválidas");
        }
        log.info("identity.login.ok userId={} alias={}", user.getId(), user.getAlias());
        return toAuth(user);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        log.info("identity.profile.get.me userId={}", userId);
        return toProfile(requireUser(userId));
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByAlias(String alias) {
        log.info("identity.profile.get.byAlias alias={}", alias);
        UserAccount user = users.findByAlias(alias)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROFILE_NOT_FOUND", "Perfil no encontrado"));
        return toProfile(user);
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        log.info("identity.profile.update userId={}", userId);
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
        log.info("identity.profile.update.ok userId={} alias={}", user.getId(), user.getAlias());
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
