package kz.iitu.hello.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/** Lab 7 — returned after a successful login/register. */
@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {

    private final String token;
    @Builder.Default
    private final String type = "Bearer";
    private final String userName;
    private final String role;
}
