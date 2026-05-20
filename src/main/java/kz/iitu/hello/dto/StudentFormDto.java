package kz.iitu.hello.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

/**
 * Lab 4 — input DTO for creating/updating a student. Validated with {@code @Valid}
 * in the controller; failures are turned into 400 by the global handler (Lab 5).
 */
@Getter
@Setter
@NoArgsConstructor
public class StudentFormDto {

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 50, message = "Student name must be between 2 and 50 characters")
    @Schema(example = "Alice")
    private String studentName;

    @NotNull(message = "Age is required")
    @Min(value = 16, message = "Age must be at least 16")
    @Max(value = 100, message = "Age must be at most 100")
    @Schema(example = "20")
    private Integer age;

    @NotBlank(message = "Group name is required")
    @Size(min = 2, max = 30, message = "Group name must be between 2 and 30 characters")
    @Schema(example = "CS-2201")
    private String groupName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100)
    @Schema(example = "alice@uni.kz")
    private String email;

    @NotNull(message = "User id is required")
    @Schema(example = "2", description = "id of an existing user to link (1:1)")
    private Long userId;

    @Schema(example = "[]", description = "ids of courses to enrol (optional)")
    private Set<Long> courseIds = new HashSet<>();
}
