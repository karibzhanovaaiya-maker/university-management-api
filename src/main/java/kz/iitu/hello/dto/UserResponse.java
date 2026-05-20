package kz.iitu.hello.dto;

import kz.iitu.hello.entity.Role;
import kz.iitu.hello.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class UserResponse {

    private final Long id;
    private final String userName;
    private final String email;
    private final Role role;
    private final LocalDateTime createdAt;

    public static UserResponse from(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .userName(u.getUserName())
                .email(u.getEmail())
                .role(u.getRole())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
