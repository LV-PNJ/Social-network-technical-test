package com.terpel.devexp.identity.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.terpel.devexp.identity.domain.UserAccount;
import com.terpel.devexp.identity.repository.UserAccountRepository;
import com.terpel.devexp.identity.security.JwtService;
import com.terpel.devexp.identity.web.dto.AuthResponse;
import com.terpel.devexp.identity.web.dto.LoginRequest;
import com.terpel.devexp.identity.web.dto.RegisterRequest;
import com.terpel.devexp.identity.web.dto.RegisterResponse;
import com.terpel.devexp.identity.web.dto.UpdateProfileRequest;
import com.terpel.devexp.identity.web.error.ApiException;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class IdentityServiceTest {

    @Mock
    private UserAccountRepository users;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private IdentityService identityService;

    private UserAccount existing;

    @BeforeEach
    void setUp() {
        existing = new UserAccount();
        existing.setId(UUID.fromString("f6e12a67-e209-447d-8ddd-1f764dcfc026"));
        existing.setAlias("demo");
        existing.setEmail("demo@devexp.local");
        existing.setPasswordHash("$2a$hashed");
        existing.setFirstName("Demo");
        existing.setLastName("Usuario");
        existing.setBirthDate(LocalDate.of(1995, 1, 15));
    }

    @Test
    void registerCreatesUserWithoutIssuingJwt() {
        RegisterRequest request = new RegisterRequest(
                "newbie",
                "newbie@test.local",
                "Secret123!",
                "Ana",
                "Perez",
                LocalDate.of(1998, 5, 20)
        );
        when(users.existsByAlias("newbie")).thenReturn(false);
        when(users.existsByEmail("newbie@test.local")).thenReturn(false);
        when(passwordEncoder.encode("Secret123!")).thenReturn("$2a$encoded");
        when(users.save(any(UserAccount.class))).thenAnswer(inv -> {
            UserAccount u = inv.getArgument(0);
            if (u.getId() == null) {
                u.setId(UUID.randomUUID());
            }
            return u;
        });

        RegisterResponse response = identityService.register(request);

        assertEquals("newbie", response.alias());
        assertTrue(response.message().toLowerCase().contains("usuario creado"));
        verify(jwtService, never()).issueToken(any(), anyString());

        ArgumentCaptor<UserAccount> captor = ArgumentCaptor.forClass(UserAccount.class);
        verify(users).save(captor.capture());
        assertEquals("$2a$encoded", captor.getValue().getPasswordHash());
        assertEquals("newbie@test.local", captor.getValue().getEmail());
    }

    @Test
    void registerRejectsDuplicateAlias() {
        RegisterRequest request = new RegisterRequest(
                "demo",
                "other@test.local",
                "Secret123!",
                "A",
                "B",
                LocalDate.of(1990, 1, 1)
        );
        when(users.existsByAlias("demo")).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () -> identityService.register(request));
        assertEquals(HttpStatus.CONFLICT, ex.getStatus());
        assertEquals("ALIAS_EXISTS", ex.getCode());
        verify(users, never()).save(any());
    }

    @Test
    void loginIssuesJwtWhenPasswordMatches() {
        when(users.findByAlias("demo")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("Demo123!", "$2a$hashed")).thenReturn(true);
        when(jwtService.issueToken(existing.getId(), "demo")).thenReturn("jwt-token");
        when(jwtService.getExpirationMs()).thenReturn(3_600_000L);

        AuthResponse auth = identityService.login(new LoginRequest("demo", "Demo123!"));

        assertEquals("jwt-token", auth.token());
        assertEquals("Bearer", auth.tokenType());
        assertEquals("demo", auth.alias());
        assertEquals(existing.getId(), auth.userId());
    }

    @Test
    void loginRejectsBadPassword() {
        when(users.findByAlias("demo")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("wrong", "$2a$hashed")).thenReturn(false);

        ApiException ex = assertThrows(
                ApiException.class,
                () -> identityService.login(new LoginRequest("demo", "wrong"))
        );
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatus());
        assertEquals("INVALID_CREDENTIALS", ex.getCode());
        verify(jwtService, never()).issueToken(any(), anyString());
    }

    @Test
    void loginFallsBackToEmailLookup() {
        when(users.findByAlias("demo@devexp.local")).thenReturn(Optional.empty());
        when(users.findByEmail("demo@devexp.local")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("Demo123!", "$2a$hashed")).thenReturn(true);
        when(jwtService.issueToken(existing.getId(), "demo")).thenReturn("jwt-token");
        when(jwtService.getExpirationMs()).thenReturn(3_600_000L);

        AuthResponse auth = identityService.login(new LoginRequest("demo@devexp.local", "Demo123!"));
        assertEquals("demo", auth.alias());
    }

    @Test
    void getProfileReturnsMappedFields() {
        when(users.findById(existing.getId())).thenReturn(Optional.of(existing));

        var profile = identityService.getProfile(existing.getId());

        assertEquals("demo", profile.alias());
        assertEquals("Demo", profile.firstName());
        assertEquals(LocalDate.of(1995, 1, 15), profile.birthDate());
    }

    @Test
    void updateProfileChangesOnlyProvidedFields() {
        when(users.findById(existing.getId())).thenReturn(Optional.of(existing));

        var updated = identityService.updateProfile(
                existing.getId(),
                new UpdateProfileRequest("Nuevo", null, null)
        );

        assertEquals("Nuevo", updated.firstName());
        assertEquals("Usuario", updated.lastName());
    }
}
