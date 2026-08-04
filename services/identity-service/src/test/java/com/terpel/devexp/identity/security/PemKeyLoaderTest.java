package com.terpel.devexp.identity.security;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.security.PrivateKey;
import java.security.PublicKey;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.DefaultResourceLoader;

class PemKeyLoaderTest {

    private final PemKeyLoader loader = new PemKeyLoader(new DefaultResourceLoader());

    @Test
    void loadsPkcs8PrivateAndX509PublicKeys() {
        PrivateKey privateKey = loader.loadPrivateKey("classpath:certs/private.key");
        PublicKey publicKey = loader.loadPublicKey("classpath:certs/public.key");
        assertNotNull(privateKey);
        assertNotNull(publicKey);
        assertTrue(privateKey.getAlgorithm().contains("RSA"));
        assertTrue(publicKey.getAlgorithm().contains("RSA"));
    }

    @Test
    void failsWhenResourceMissing() {
        assertThrows(
                IllegalStateException.class,
                () -> loader.loadPrivateKey("classpath:certs/missing.key")
        );
    }
}
