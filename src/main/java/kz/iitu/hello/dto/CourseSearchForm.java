package kz.iitu.hello.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Lab 6 — optional filter fields bound from query params. Any null/blank field is
 * skipped when building the {@code Specification}, so all-null means "no WHERE".
 */
@Getter
@Setter
@NoArgsConstructor
public class CourseSearchForm {

    private String courseName;
    private String exactCourseName;
    private Integer creditsFrom;
    private Integer creditsTo;
    private Integer maxStudentsFrom;
    private Integer maxStudentsTo;
    private Long teacherId;
}
