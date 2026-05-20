package kz.iitu.hello.service;

import jakarta.persistence.EntityNotFoundException;
import kz.iitu.hello.dto.StudentFormDto;
import kz.iitu.hello.entity.Student;
import kz.iitu.hello.entity.User;
import kz.iitu.hello.exception.BusinessException;
import kz.iitu.hello.repository.CoursesRepository;
import kz.iitu.hello.repository.StudentsRepository;
import kz.iitu.hello.repository.UsersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Lab 9 — {@code @ExtendWith(MockitoExtension.class)} wires Mockito into JUnit 5,
 * {@code @Mock} fakes the repositories and {@code @InjectMocks} builds the real service
 * with those mocks injected.
 */
@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentsRepository studentRepository;
    @Mock
    private UsersRepository userRepository;
    @Mock
    private CoursesRepository coursesRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    void findById_whenStudentDoesNotExist_throwsEntityNotFoundException() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.findById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void findById_whenStudentExists_returnsStudent() {
        Student student = Student.builder().id(1L).studentName("Alice").build();
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        assertThat(studentService.findById(1L)).isSameAs(student);
    }

    @Test
    void create_whenUserAlreadyLinkedToStudent_throwsBusinessException() {
        StudentFormDto form = newForm();
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));
        when(studentRepository.existsByUserId(1L)).thenReturn(true);

        assertThatThrownBy(() -> studentService.create(form))
                .isInstanceOf(BusinessException.class);
        verify(studentRepository, never()).save(any());
    }

    @Test
    void create_whenValid_savesStudent() {
        StudentFormDto form = newForm();
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));
        when(studentRepository.existsByUserId(1L)).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenAnswer(inv -> inv.getArgument(0));

        Student saved = studentService.create(form);

        assertThat(saved.getStudentName()).isEqualTo("Alice");
        assertThat(saved.getGroupName()).isEqualTo("CS-2201");
        verify(studentRepository).save(any(Student.class));
    }

    private StudentFormDto newForm() {
        StudentFormDto form = new StudentFormDto();
        form.setStudentName("Alice");
        form.setAge(20);
        form.setGroupName("CS-2201");
        form.setEmail("alice@university.kz");
        form.setUserId(1L);
        return form;
    }
}
