package kz.iitu.hello.config;

import kz.iitu.hello.entity.Role;
import kz.iitu.hello.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Seeds a default ADMIN account on first start so the API is usable immediately
 * (login at {@code POST /auth/login}). Toggle with {@code app.seed.admin.enabled}.
 */
@Component
@ConditionalOnProperty(name = "app.seed.admin.enabled", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserService userService;
    private final String adminUsername;
    private final String adminPassword;

    public DataSeeder(UserService userService,
                      @Value("${app.seed.admin.username}") String adminUsername,
                      @Value("${app.seed.admin.password}") String adminPassword) {
        this.userService = userService;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (userService.existsByUserName(adminUsername)) {
            return;
        }
        userService.register(adminUsername, adminUsername + "@university.local", adminPassword, Role.ADMIN);
        log.info("Seeded default ADMIN user '{}' (change the password!)", adminUsername);
    }
}
