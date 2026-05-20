package kz.iitu.hello;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * University Management Application — entry point.
 *
 * <p>This single Spring Boot app implements all ten lab works:
 * <ol>
 *   <li>Controllers, GET requests, MVC vs REST</li>
 *   <li>CRUD with Spring Data JPA</li>
 *   <li>Related entities (1:1, 1:N, M:N)</li>
 *   <li>DTOs and form validation</li>
 *   <li>Global exception handling</li>
 *   <li>Filtering, sorting, pagination</li>
 *   <li>Authentication &amp; authorization (JWT + Spring Security)</li>
 *   <li>File upload API (multipart)</li>
 *   <li>Unit testing (JUnit 5 + Mockito)</li>
 *   <li>API documentation (Swagger / OpenAPI)</li>
 * </ol>
 */
@SpringBootApplication
public class HelloApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloApplication.class, args);
    }
}
