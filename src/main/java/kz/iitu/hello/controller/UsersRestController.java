package kz.iitu.hello.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kz.iitu.hello.dto.UserFormDto;
import kz.iitu.hello.dto.UserResponse;
import kz.iitu.hello.dto.UserSearchForm;
import kz.iitu.hello.exception.ValidationException;
import kz.iitu.hello.service.UserService;
import kz.iitu.hello.validation.UserFormValidator;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Labs 2/4/6/10 — full CRUD + custom validation + paginated search (ADMIN only). */
@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "CRUD + search for users (ADMIN only)")
public class UsersRestController {

    private final UserService userService;
    private final UserFormValidator userFormValidator;

    public UsersRestController(UserService userService, UserFormValidator userFormValidator) {
        this.userService = userService;
        this.userFormValidator = userFormValidator;
    }

    @GetMapping
    @Operation(summary = "List users", description = "All users (unpaged)")
    public List<UserResponse> findAll() {
        return userService.findAll().stream().map(UserResponse::from).toList();
    }

    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Filter + sort + paginate")
    public Page<UserResponse> search(@ModelAttribute UserSearchForm form,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size,
                                     @RequestParam(defaultValue = "id") String sortBy,
                                     @RequestParam(defaultValue = "asc") String direction) {
        return userService.search(form, page, size, sortBy, direction).map(UserResponse::from);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by id")
    public UserResponse findById(@Parameter(description = "User id") @PathVariable Long id) {
        return UserResponse.from(userService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create user")
    public UserResponse create(@Valid @RequestBody UserFormDto form) {
        runUniquenessValidation(form, null);
        return UserResponse.from(userService.create(form));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user")
    public UserResponse update(@Parameter(description = "User id") @PathVariable Long id,
                               @Valid @RequestBody UserFormDto form) {
        runUniquenessValidation(form, id);
        return UserResponse.from(userService.update(id, form));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete user")
    public void delete(@Parameter(description = "User id") @PathVariable Long id) {
        userService.delete(id);
    }

    /** Runs the Lab 4 custom validator; collects any field errors into a 400 response. */
    private void runUniquenessValidation(UserFormDto form, Long currentId) {
        BindingResult bindingResult = new BeanPropertyBindingResult(form, "userFormDto");
        userFormValidator.validate(form, bindingResult, currentId);
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            throw new ValidationException(errors);
        }
    }
}
