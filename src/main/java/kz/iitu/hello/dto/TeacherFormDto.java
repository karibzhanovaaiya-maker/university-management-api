package kz.iitu.hello.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TeacherFormDto {

    @NotBlank(message = "Teacher name is required")
    @Size(min = 2, max = 100, message = "Teacher name must be between 2 and 100 characters")
    @Schema(example = "Dr. Smith")
    private String teacherName;
}
