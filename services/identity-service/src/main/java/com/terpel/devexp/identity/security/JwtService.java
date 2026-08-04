package com.terpel.devexp.identity.security;

import com.terpel.devexp.identity.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Date;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final JwtProperties properties;
    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    public JwtService(JwtProperties properties, PemKeyLoader pemKeyLoader) {
        this.properties = properties;
        this.privateKey = pemKeyLoader.loadPrivateKey(properties.getPrivateKeyLocation());
        this.publicKey = pemKeyLoader.loadPublicKey(properties.getPublicKeyLocation());
        log.info(
                "identity.jwt.ready algorithm=RS256 issuer={} privateKey={} publicKey={}",
                properties.getIssuer(),
                properties.getPrivateKeyLocation(),
                properties.getPublicKeyLocation()
        );
    }

    public String issueToken(UUID userId, String alias) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + properties.getExpirationMs());
        return Jwts.builder()
                .issuer(properties.getIssuer())
                .subject(userId.toString())
                .claim("alias", alias)
                .claim("role", "user")
                .issuedAt(now)
                .expiration(exp)
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(publicKey)
                .requireIssuer(properties.getIssuer())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getExpirationMs() {
        return properties.getExpirationMs();
    }
}
