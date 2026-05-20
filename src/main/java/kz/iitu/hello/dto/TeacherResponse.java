package kz.iitu.hello.dto;

import kz.iitu.hello.entity.Teacher;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TeacherResponse {

    private final Long id;
    private final String teacherName;
    private final int courseCount;

    public static TeacherResponse from(Teacher t) {
        return TeacherResponse.builder()
                .id(t.getId())
                .teacherName(t.getTeacherName())
                .courseCount(t.getCourses() != null ? t.getCourses().size() : 0)
                .build();
    }
}
