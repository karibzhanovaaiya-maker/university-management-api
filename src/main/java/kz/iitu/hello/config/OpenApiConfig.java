package kz.iitu.hello.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Lab 10 — global OpenAPI document. Sets the info block and registers a Bearer-JWT
 * security scheme so Swagger UI shows an "Authorize" button to paste a token.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                // Relative server -> Swagger "Try it out" uses the current origin/scheme
                // (https via nginx), avoiding mixed-content blocks behind the proxy.
                .servers(List.of(new Server().url("/")))
                .info(new Info()
                        .title("University Management API")
                        .version("1.0.0")
                        .description("Spring Boot lab project covering labs 1-10."))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
