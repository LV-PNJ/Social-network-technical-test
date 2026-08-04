package com.terpel.devexp.identity.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    /**
     * Spring Resource location for RSA private key (PKCS#8 PEM).
     * Examples: classpath:certs/private.key , file:/app/certs/private.key
     */
    private String privateKeyLocation = "classpath:certs/private.key";
    /**
     * Spring Resource location for RSA public key (X.509 PEM).
     */
    private String publicKeyLocation = "classpath:certs/public.key";
    private long expirationMs = 3_600_000;
    private String issuer = "identity-service";

    public String getPrivateKeyLocation() {
        return privateKeyLocation;
    }

    public void setPrivateKeyLocation(String privateKeyLocation) {
        this.privateKeyLocation = privateKeyLocation;
    }

    public String getPublicKeyLocation() {
        return publicKeyLocation;
    }

    public void setPublicKeyLocation(String publicKeyLocation) {
        this.publicKeyLocation = publicKeyLocation;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }
}
