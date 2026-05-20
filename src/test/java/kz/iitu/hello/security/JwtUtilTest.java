package kz.iitu.hello.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    // base64("test-secret-key-for-unit-tests-please-change-me") — 47 bytes, valid for HS256
    private static final String SECRET =
            "dGVzdC1zZWNyZXQta2V5LWZvci11bml0LXRlc3RzLXBsZWFzZS1jaGFuZ2UtbWU=";

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(SECRET, 3_600_000L);
    }

    @Test
    void generateThenExtract_roundTripsUsername() {
        String token = jwtUtil.generateToken("alice");

        assertThat(jwtUtil.isValid(token)).isTrue();
        assertThat(jwtUtil.extractUsername(token)).isEqualTo("alice");
    }

    @Test
    void isValid_returnsFalseForGarbageToken() {
        assertThat(jwtUtil.isValid("not-a-real-token")).isFalse();
    }

    @Test
    void isValid_returnsFalseForExpiredToken() {
        JwtUtil shortLived = new JwtUtil(SECRET, -1_000L); // already expired
        String token = shortLived.generateToken("bob");

        assertThat(shortLived.isValid(token)).isFalse();
    }
}
