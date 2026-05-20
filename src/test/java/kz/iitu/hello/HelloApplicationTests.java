package kz.iitu.hello;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Lab 9 — full-context smoke test. Boots the entire Spring application (all beans,
 * security, JPA against in-memory H2) to prove the wiring is correct.
 */
@SpringBootTest
class HelloApplicationTests {

    @Test
    void contextLoads() {
    }
}
