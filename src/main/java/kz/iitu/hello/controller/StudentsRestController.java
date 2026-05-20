package kz.iitu.hello.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kz.iitu.hello.dto.StudentFormDto;
import kz.iitu.hello.dto.StudentResponse;
import kz.iitu.hello.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Labs 3/4/10 — CRUD for students (ADMIN only). */
@RestController
@RequestMapping("/api/students")
@Tag(name = "Students", description = "CRUD operations for students (ADMIN only)")
public class StudentsRestController {

    private final StudentService studentService;

    public StudentsRestController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    @Operation(summary = "List students")
    public List<StudentResponse> findAll() {
        return studentService.findAll().stream().map(StudentResponse::from).toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by id")
    public StudentResponse findById(@Parameter(description = "Student id") @PathVariable Long id) {
        return StudentResponse.from(studentService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create student", description = "Create a new student linked to an existing user")
    public StudentResponse create(@Valid @RequestBody StudentFormDto form) {
        return StudentResponse.from(studentService.create(form));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update student")
    public StudentResponse update(@Parameter(description = "Student id") @PathVariable Long id,
                                  @Valid @RequestBody StudentFormDto form) {
        return StudentResponse.from(studentService.update(id, form));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete student", description = "Delete a student by ID")
    public void delete(@Parameter(description = "Student ID to delete") @PathVariable Long id) {
        studentService.delete(id);
    }
}
