package kz.iitu.hello.dto;

import kz.iitu.hello.entity.Course;
import kz.iitu.hello.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor
public class StudentResponse {

    private final Long id;
    private final String studentName;
    private final Integer age;
    private final String groupName;
    private final String email;
    private final Long userId;
    private final Set<Long> courseIds;

    public static StudentResponse from(Student s) {
        return StudentResponse.builder()
                .id(s.getId())
                .studentName(s.getStudentName())
                .age(s.getAge())
                .groupName(s.getGroupName())
                .email(s.getEmail())
                .userId(s.getUser() != null ? s.getUser().getId() : null)
                .courseIds(s.getCourses() != null
                        ? s.getCourses().stream().map(Course::getId).collect(Collectors.toSet())
                        : Set.of())
                .build();
    }
}
