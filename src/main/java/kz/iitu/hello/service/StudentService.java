package kz.iitu.hello.service;

import jakarta.persistence.EntityNotFoundException;
import kz.iitu.hello.dto.StudentFormDto;
import kz.iitu.hello.entity.Course;
import kz.iitu.hello.entity.Student;
import kz.iitu.hello.entity.User;
import kz.iitu.hello.exception.BusinessException;
import kz.iitu.hello.repository.CoursesRepository;
import kz.iitu.hello.repository.StudentsRepository;
import kz.iitu.hello.repository.UsersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class StudentService {

    private final StudentsRepository studentRepository;
    private final UsersRepository userRepository;
    private final CoursesRepository coursesRepository;

    public StudentService(StudentsRepository studentRepository,
                          UsersRepository userRepository,
                          CoursesRepository coursesRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.coursesRepository = coursesRepository;
    }

    @Transactional(readOnly = true)
    public Student findById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + id));
        initAssociations(student);
        return student;
    }

    @Transactional(readOnly = true)
    public List<Student> findAll() {
        List<Student> students = studentRepository.findAll();
        students.forEach(this::initAssociations);
        return students;
    }

    /** Touch lazy user + courses inside the tx so DTO mapping works after it closes. */
    private void initAssociations(Student student) {
        if (student.getUser() != null) {
            student.getUser().getId();
        }
        student.getCourses().size();
    }

    @Transactional
    public Student create(StudentFormDto form) {
        User user = userRepository.findById(form.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + form.getUserId()));

        if (studentRepository.existsByUserId(form.getUserId())) {
            throw new BusinessException("This user is already linked to a student");
        }

        Student student = Student.builder()
                .studentName(form.getStudentName())
                .age(form.getAge())
                .groupName(form.getGroupName())
                .email(form.getEmail())
                .user(user)
                .courses(resolveCourses(form.getCourseIds()))
                .build();
        return studentRepository.save(student);
    }

    @Transactional
    public Student update(Long id, StudentFormDto form) {
        Student student = findById(id);
        student.setStudentName(form.getStudentName());
        student.setAge(form.getAge());
        student.setGroupName(form.getGroupName());
        student.setEmail(form.getEmail());
        student.setCourses(resolveCourses(form.getCourseIds()));
        return studentRepository.save(student);
    }

    @Transactional
    public void delete(Long id) {
        Student student = findById(id);
        studentRepository.delete(student);
    }

    private Set<Course> resolveCourses(Set<Long> courseIds) {
        Set<Course> courses = new HashSet<>();
        if (courseIds == null || courseIds.isEmpty()) {
            return courses;
        }
        for (Long courseId : courseIds) {
            Course course = coursesRepository.findById(courseId)
                    .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + courseId));
            courses.add(course);
        }
        return courses;
    }
}
