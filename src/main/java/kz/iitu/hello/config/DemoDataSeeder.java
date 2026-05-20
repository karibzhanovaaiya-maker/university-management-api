package kz.iitu.hello.config;

import kz.iitu.hello.dto.CourseFormDto;
import kz.iitu.hello.dto.StudentFormDto;
import kz.iitu.hello.dto.TeacherFormDto;
import kz.iitu.hello.entity.Role;
import kz.iitu.hello.entity.Teacher;
import kz.iitu.hello.entity.User;
import kz.iitu.hello.repository.CoursesRepository;
import kz.iitu.hello.service.CourseService;
import kz.iitu.hello.service.StudentService;
import kz.iitu.hello.service.TeacherService;
import kz.iitu.hello.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds a little demo data (teachers, courses, a student) so the app is easy to
 * demonstrate. Safe: it only runs on an EMPTY database (no courses), so it never
 * duplicates or touches existing data. Toggle with {@code app.seed.demo.enabled}.
 */
@Component
@Order(2)
@ConditionalOnProperty(name = "app.seed.demo.enabled", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final CoursesRepository coursesRepository;
    private final TeacherService teacherService;
    private final CourseService courseService;
    private final UserService userService;
    private final StudentService studentService;

    public DemoDataSeeder(CoursesRepository coursesRepository, TeacherService teacherService,
                          CourseService courseService, UserService userService,
                          StudentService studentService) {
        this.coursesRepository = coursesRepository;
        this.teacherService = teacherService;
        this.courseService = courseService;
        this.userService = userService;
        this.studentService = studentService;
    }

    @Override
    public void run(String... args) {
        if (coursesRepository.count() > 0) {
            return; // only seed an empty database — never duplicate existing data
        }

        Teacher smith = teacherService.create(teacher("Dr. Smith"));
        Teacher johnson = teacherService.create(teacher("Prof. Johnson"));

        courseService.create(course("Algorithms", 5, 30, smith.getId()));
        courseService.create(course("Databases", 4, 40, smith.getId()));
        courseService.create(course("Operating Systems", 5, 35, johnson.getId()));

        if (!userService.existsByUserName("alice")) {
            User alice = userService.register("alice", "alice@uni.kz", "alice123", Role.STUDENT);
            studentService.create(student("Alice", 20, "CS-2201", "alice@uni.kz", alice.getId()));
        }

        log.info("Seeded demo data (teachers, courses, a student) into an empty database.");
    }

    private TeacherFormDto teacher(String name) {
        TeacherFormDto dto = new TeacherFormDto();
        dto.setTeacherName(name);
        return dto;
    }

    private CourseFormDto course(String name, int credits, int max, Long teacherId) {
        CourseFormDto dto = new CourseFormDto();
        dto.setCourseName(name);
        dto.setCredits(credits);
        dto.setMaxStudents(max);
        dto.setTeacherId(teacherId);
        return dto;
    }

    private StudentFormDto student(String name, int age, String group, String email, Long userId) {
        StudentFormDto dto = new StudentFormDto();
        dto.setStudentName(name);
        dto.setAge(age);
        dto.setGroupName(group);
        dto.setEmail(email);
        dto.setUserId(userId);
        return dto;
    }
}
