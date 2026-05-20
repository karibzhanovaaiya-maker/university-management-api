package kz.iitu.hello.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kz.iitu.hello.dto.CourseFormDto;
import kz.iitu.hello.dto.CourseResponse;
import kz.iitu.hello.dto.CourseSearchForm;
import kz.iitu.hello.service.CourseService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Labs 6/7/10 — courses. {@code GET /api/courses} is open to any authenticated user;
 * writes and search are ADMIN-only (see {@code SecurityConfig}).
 */
@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Course listing (any user) + admin CRUD/search")
public class CoursesRestController {

    private final CourseService courseService;

    public CoursesRestController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    @Operation(summary = "List courses", description = "Available to any authenticated user")
    public List<CourseResponse> findAll() {
        return courseService.findAll().stream().map(CourseResponse::from).toList();
    }

    @GetMapping("/search")
    @Operation(summary = "Search courses", description = "Filter + sort + paginate (ADMIN)")
    public Page<CourseResponse> search(@ModelAttribute CourseSearchForm form,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(defaultValue = "id") String sortBy,
                                       @RequestParam(defaultValue = "asc") String direction) {
        return courseService.search(form, page, size, sortBy, direction).map(CourseResponse::from);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by id")
    public CourseResponse findById(@Parameter(description = "Course id") @PathVariable Long id) {
        return CourseResponse.from(courseService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create course")
    public CourseResponse create(@Valid @RequestBody CourseFormDto form) {
        return CourseResponse.from(courseService.create(form));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update course")
    public CourseResponse update(@Parameter(description = "Course id") @PathVariable Long id,
                                 @Valid @RequestBody CourseFormDto form) {
        return CourseResponse.from(courseService.update(id, form));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete course")
    public void delete(@Parameter(description = "Course id") @PathVariable Long id) {
        courseService.delete(id);
    }
}
