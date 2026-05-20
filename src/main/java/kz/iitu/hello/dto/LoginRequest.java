package kz.iitu.hello.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Lab 7 — credentials for {@code POST /auth/login}. */
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Username is required")
    @Schema(example = "admin")
    private String userName;

    @NotBlank(message = "Password is required")
    @Schema(example = "your-password", description = "your real password (the public docs do not contain it)")
    private String password;
}
