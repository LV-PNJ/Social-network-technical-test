package com.terpel.devexp.identity.security;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;

/**
 * Ephemeral RSA PEMs for unit tests — never commit real keys.
 */
final class TestRsaKeys {

    final Path privateKeyPem;
    final Path publicKeyPem;
    final Path directory;

    private TestRsaKeys(Path directory, Path privateKeyPem, Path publicKeyPem) {
        this.directory = directory;
        this.privateKeyPem = privateKeyPem;
        this.publicKeyPem = publicKeyPem;
    }

    static TestRsaKeys generate() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        KeyPair pair = generator.generateKeyPair();

        Path dir = Files.createTempDirectory("devexp-jwt-test-");
        Path privatePem = dir.resolve("private.key");
        Path publicPem = dir.resolve("public.key");

        Files.writeString(
                privatePem,
                toPem("PRIVATE KEY", pair.getPrivate().getEncoded()),
                StandardCharsets.UTF_8
        );
        Files.writeString(
                publicPem,
                toPem("PUBLIC KEY", pair.getPublic().getEncoded()),
                StandardCharsets.UTF_8
        );
        return new TestRsaKeys(dir, privatePem, publicPem);
    }

    String privateLocation() {
        return privateKeyPem.toAbsolutePath().toUri().toString();
    }

    String publicLocation() {
        return publicKeyPem.toAbsolutePath().toUri().toString();
    }

    private static String toPem(String type, byte[] der) {
        String b64 = Base64.getMimeEncoder(64, "\n".getBytes(StandardCharsets.UTF_8))
                .encodeToString(der);
        return "-----BEGIN " + type + "-----\n" + b64 + "\n-----END " + type + "-----\n";
    }
}
