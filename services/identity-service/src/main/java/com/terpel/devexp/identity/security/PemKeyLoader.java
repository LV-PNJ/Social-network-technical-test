package com.terpel.devexp.identity.security;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

@Component
public class PemKeyLoader {

    private final ResourceLoader resourceLoader;

    public PemKeyLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public PrivateKey loadPrivateKey(String location) {
        try {
            byte[] der = decodePem(read(location), "PRIVATE KEY");
            return KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(der));
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo cargar la llave privada JWT desde " + location, ex);
        }
    }

    public PublicKey loadPublicKey(String location) {
        try {
            byte[] der = decodePem(read(location), "PUBLIC KEY");
            return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(der));
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo cargar la llave pública JWT desde " + location, ex);
        }
    }

    private String read(String location) throws IOException {
        Resource resource = resourceLoader.getResource(location);
        if (!resource.exists()) {
            throw new IOException("Recurso no encontrado: " + location);
        }
        try (InputStream in = resource.getInputStream()) {
            return StreamUtils.copyToString(in, StandardCharsets.UTF_8);
        }
    }

    private static byte[] decodePem(String pem, String type) {
        String normalized = pem
                .replace("-----BEGIN " + type + "-----", "")
                .replace("-----END " + type + "-----", "")
                .replaceAll("\\s", "");
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("PEM vacío para " + type);
        }
        return Base64.getDecoder().decode(normalized);
    }
}
