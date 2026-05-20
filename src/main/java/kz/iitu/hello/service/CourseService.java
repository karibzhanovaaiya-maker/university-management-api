package kz.iitu.hello.service;

import jakarta.persistence.EntityNotFoundException;
import kz.iitu.hello.dto.CourseFormDto;
import kz.iitu.hello.dto.CourseSearchForm;
import kz.iitu.hello.entity.Course;
import kz.iitu.hello.entity.Teacher;
import kz.iitu.hello.repository.CoursesRepository;
import kz.iitu.hello.repository.TeachersRepository;
import kz.iitu.hello.spec.CourseSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class CourseService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "courseName", "credits", "maxStudents");
    private static final String DEFAULT_SORT = "id";

    private final CoursesRepository coursesRepository;
    private final TeachersRepository teachersRepository;

    public CourseService(CoursesRepository coursesRepository, TeachersRepository teachersRepository) {
        this.coursesRepository = coursesRepository;
        this.teachersRepository = teachersRepository;
    }

    @Transactional(readOnly = true)
    public Course findById(Long id) {
        Course course = coursesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + id));
        initTeacher(course);
        return course;
    }

    @Transactional(readOnly = true)
    public List<Course> findAll() {
        List<Course> courses = coursesRepository.findAll();
        courses.forEach(this::initTeacher);
        return courses;
    }

    @Transactional
    public Course create(CourseFormDto form) {
        Course course = Course.builder()
                .courseName(form.getCourseName())
                .credits(form.getCredits())
                .maxStudents(form.getMaxStudents())
                .teacher(resolveTeacher(form.getTeacherId()))
                .build();
        return coursesRepository.save(course);
    }

    @Transactional
    public Course update(Long id, CourseFormDto form) {
        Course course = findById(id);
        course.setCourseName(form.getCourseName());
        course.setCredits(form.getCredits());
        course.setMaxStudents(form.getMaxStudents());
        course.setTeacher(resolveTeacher(form.getTeacherId()));
        return coursesRepository.save(course);
    }

    @Transactional
    public void delete(Long id) {
        Course course = findById(id);
        coursesRepository.delete(course);
    }

    /** Lab 6 — filter (Specification) + safe sort (whitelist) + pagination. */
    @Transactional(readOnly = true)
    public Page<Course> search(CourseSearchForm form, int page, int size,
                               String requestedSortBy, String direction) {
        String sortBy = ALLOWED_SORT_FIELDS.contains(requestedSortBy) ? requestedSortBy : DEFAULT_SORT;
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
        Page<Course> result = coursesRepository.findAll(CourseSpecification.withFilters(form), pageable);
        result.getContent().forEach(this::initTeacher);
        return result;
    }

    /** Touch the lazy teacher inside the tx so DTO mapping works after it closes. */
    private void initTeacher(Course course) {
        if (course.getTeacher() != null) {
            course.getTeacher().getTeacherName();
        }
    }

    private Teacher resolveTeacher(Long teacherId) {
        if (teacherId == null) {
            return null;
        }
        return teachersRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));
    }
}
