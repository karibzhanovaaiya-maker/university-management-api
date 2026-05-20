package kz.iitu.hello.service;

import jakarta.persistence.EntityNotFoundException;
import kz.iitu.hello.dto.CourseFormDto;
import kz.iitu.hello.entity.Course;
import kz.iitu.hello.entity.Teacher;
import kz.iitu.hello.repository.CoursesRepository;
import kz.iitu.hello.repository.TeachersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CoursesRepository coursesRepository;
    @Mock
    private TeachersRepository teachersRepository;

    @InjectMocks
    private CourseService courseService;

    @Test
    void findById_whenMissing_throwsEntityNotFoundException() {
        when(coursesRepository.findById(123L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> courseService.findById(123L))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void create_withTeacherId_resolvesAndAttachesTeacher() {
        Teacher teacher = Teacher.builder().id(2L).teacherName("Dr. Smith").build();
        when(teachersRepository.findById(2L)).thenReturn(Optional.of(teacher));
        when(coursesRepository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

        CourseFormDto form = new CourseFormDto();
        form.setCourseName("Algorithms");
        form.setCredits(5);
        form.setMaxStudents(30);
        form.setTeacherId(2L);

        Course created = courseService.create(form);

        assertThat(created.getCourseName()).isEqualTo("Algorithms");
        assertThat(created.getTeacher()).isSameAs(teacher);
    }

    @Test
    void create_withMissingTeacher_throwsEntityNotFoundException() {
        when(teachersRepository.findById(9L)).thenReturn(Optional.empty());

        CourseFormDto form = new CourseFormDto();
        form.setCourseName("Databases");
        form.setCredits(4);
        form.setMaxStudents(40);
        form.setTeacherId(9L);

        assertThatThrownBy(() -> courseService.create(form))
                .isInstanceOf(EntityNotFoundException.class);
    }
}
