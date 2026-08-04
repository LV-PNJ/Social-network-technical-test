package com.terpel.devexp.identity.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.terpel.devexp.identity.config.JwtProperties;
import io.jsonwebtoken.security.SignatureException;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.DefaultResourceLoader;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() throws Exception {
        TestRsaKeys keys = TestRsaKeys.generate();
        JwtProperties props = new JwtProperties();
        props.setPrivateKeyLocation(keys.privateLocation());
        props.setPublicKeyLocation(keys.publicLocation());
        props.setExpirationMs(3_600_000);
        props.setIssuer("identity-service");
        PemKeyLoader loader = new PemKeyLoader(new DefaultResourceLoader());
        jwtService = new JwtService(props, loader);
    }

    @Test
    void issuesAndParsesTokenWithAliasUsingRs256() {
        UUID id = UUID.fromString("f6e12a67-e209-447d-8ddd-1f764dcfc026");
        String token = jwtService.issueToken(id, "demo");
        var claims = jwtService.parse(token);
        assertEquals(id.toString(), claims.getSubject());
        assertEquals("demo", claims.get("alias", String.class));
        assertEquals("identity-service", claims.getIssuer());
    }

    @Test
    void rejectsTamperedToken() {
        UUID id = UUID.randomUUID();
        String token = jwtService.issueToken(id, "demo") + "x";
        assertThrows(SignatureException.class, () -> jwtService.parse(token));
    }
}
