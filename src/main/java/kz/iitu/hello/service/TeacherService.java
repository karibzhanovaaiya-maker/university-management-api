package kz.iitu.hello.service;

import jakarta.persistence.EntityNotFoundException;
import kz.iitu.hello.dto.TeacherFormDto;
import kz.iitu.hello.entity.Teacher;
import kz.iitu.hello.exception.BusinessException;
import kz.iitu.hello.repository.TeachersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherService {

    private final TeachersRepository teachersRepository;

    public TeacherService(TeachersRepository teachersRepository) {
        this.teachersRepository = teachersRepository;
    }

    @Transactional(readOnly = true)
    public Teacher findById(Long id) {
        Teacher teacher = teachersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + id));
        teacher.getCourses().size(); // initialize lazy courses inside the tx
        return teacher;
    }

    @Transactional(readOnly = true)
    public List<Teacher> findAll() {
        List<Teacher> teachers = teachersRepository.findAll();
        teachers.forEach(t -> t.getCourses().size());
        return teachers;
    }

    @Transactional
    public Teacher create(TeacherFormDto form) {
        Teacher teacher = Teacher.builder()
                .teacherName(form.getTeacherName())
                .build();
        return teachersRepository.save(teacher);
    }

    @Transactional
    public Teacher update(Long id, TeacherFormDto form) {
        Teacher teacher = findById(id);
        teacher.setTeacherName(form.getTeacherName());
        return teachersRepository.save(teacher);
    }

    /**
     * Lab 5/9 — business rule: a teacher with assigned courses cannot be deleted.
     * Violations surface as 409 Conflict via {@link BusinessException}.
     */
    @Transactional
    public void delete(Long id) {
        Teacher teacher = findById(id);
        if (teacher.getCourses() != null && !teacher.getCourses().isEmpty()) {
            throw new BusinessException("Cannot delete teacher with assigned courses");
        }
        teachersRepository.delete(teacher);
    }
}
