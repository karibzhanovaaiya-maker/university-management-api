package kz.iitu.hello.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kz.iitu.hello.dto.TeacherFormDto;
import kz.iitu.hello.dto.TeacherResponse;
import kz.iitu.hello.service.TeacherService;
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

/** Labs 3/9/10 — CRUD for teachers (ADMIN only). Delete enforces the no-courses rule. */
@RestController
@RequestMapping("/api/teachers")
@Tag(name = "Teachers", description = "CRUD operations for teachers (ADMIN only)")
public class TeachersRestController {

    private final TeacherService teacherService;

    public TeachersRestController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    @Operation(summary = "List teachers")
    public List<TeacherResponse> findAll() {
        return teacherService.findAll().stream().map(TeacherResponse::from).toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get teacher by id")
    public TeacherResponse findById(@Parameter(description = "Teacher id") @PathVariable Long id) {
        return TeacherResponse.from(teacherService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create teacher")
    public TeacherResponse create(@Valid @RequestBody TeacherFormDto form) {
        return TeacherResponse.from(teacherService.create(form));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update teacher")
    public TeacherResponse update(@Parameter(description = "Teacher id") @PathVariable Long id,
                                  @Valid @RequestBody TeacherFormDto form) {
        return TeacherResponse.from(teacherService.update(id, form));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete teacher", description = "Fails with 409 if the teacher still has courses")
    public void delete(@Parameter(description = "Teacher id") @PathVariable Long id) {
        teacherService.delete(id);
    }
}
