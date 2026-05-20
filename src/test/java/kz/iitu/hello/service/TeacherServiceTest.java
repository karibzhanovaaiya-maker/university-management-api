package kz.iitu.hello.service;

import jakarta.persistence.EntityNotFoundException;
import kz.iitu.hello.entity.Course;
import kz.iitu.hello.entity.Teacher;
import kz.iitu.hello.exception.BusinessException;
import kz.iitu.hello.repository.TeachersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {

    @Mock
    private TeachersRepository teachersRepository;

    @InjectMocks
    private TeacherService teacherService;

    /** Lab 9 drill — deleting a teacher who still has courses must throw BusinessException. */
    @Test
    void delete_whenTeacherHasCourses_throwsBusinessException() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setCourses(List.of(new Course())); // non-empty
        when(teachersRepository.findById(1L)).thenReturn(Optional.of(teacher));

        assertThatThrownBy(() -> teacherService.delete(1L))
                .isInstanceOf(BusinessException.class);
        verify(teachersRepository, never()).delete(any(Teacher.class));
    }

    @Test
    void delete_whenTeacherHasNoCourses_deletes() {
        Teacher teacher = new Teacher();
        teacher.setId(2L);
        teacher.setCourses(new ArrayList<>());
        when(teachersRepository.findById(2L)).thenReturn(Optional.of(teacher));

        teacherService.delete(2L);

        verify(teachersRepository).delete(teacher);
    }

    @Test
    void findById_whenMissing_throwsEntityNotFoundException() {
        when(teachersRepository.findById(50L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> teacherService.findById(50L))
                .isInstanceOf(EntityNotFoundException.class);
    }
}
