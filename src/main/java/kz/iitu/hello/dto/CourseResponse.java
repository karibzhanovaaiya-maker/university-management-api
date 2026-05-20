package kz.iitu.hello.dto;

import kz.iitu.hello.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CourseResponse {

    private final Long id;
    private final String courseName;
    private final Integer credits;
    private final Integer maxStudents;
    private final Long teacherId;
    private final String teacherName;

    public static CourseResponse from(Course c) {
        return CourseResponse.builder()
                .id(c.getId())
                .courseName(c.getCourseName())
                .credits(c.getCredits())
                .maxStudents(c.getMaxStudents())
                .teacherId(c.getTeacher() != null ? c.getTeacher().getId() : null)
                .teacherName(c.getTeacher() != null ? c.getTeacher().getTeacherName() : null)
                .build();
    }
}
