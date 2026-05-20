package kz.iitu.hello.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Lab 5 — one central place that turns exceptions into clean JSON responses.
 *
 * <p>{@code @RestControllerAdvice} applies these handlers across all controllers and
 * writes the returned object as the response body.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 404 — entity lookups that fail (see {@code orElseThrow}). */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(404)
                .body(buildErrorResponse(404, "Not Found", ex.getMessage(), request.getRequestURI(), null));
    }

    /** 400 — bean-validation failures on {@code @Valid} request bodies. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex,
                                                                   HttpServletRequest request) {
        Map<String, String> validationErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.badRequest()
                .body(buildErrorResponse(400, "Bad Request", "Validation failed",
                        request.getRequestURI(), validationErrors));
    }

    /** 400 — custom (non-annotation) validation failures, e.g. uniqueness checks. */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleCustomValidation(ValidationException ex,
                                                                HttpServletRequest request) {
        return ResponseEntity.badRequest()
                .body(buildErrorResponse(400, "Bad Request", "Validation failed",
                        request.getRequestURI(), ex.getErrors()));
    }

    /** 401 — bad credentials / authentication failures (Lab 7 login). */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException ex,
                                                              HttpServletRequest request) {
        return ResponseEntity.status(401)
                .body(buildErrorResponse(401, "Unauthorized", "Invalid username or password",
                        request.getRequestURI(), null));
    }

    /** 409 — business-rule violations. */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex, HttpServletRequest request) {
        return ResponseEntity.status(409)
                .body(buildErrorResponse(409, "Conflict", ex.getMessage(), request.getRequestURI(), null));
    }

    /** 403 — authenticated but not allowed (Lab 7 drill). */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return ResponseEntity.status(403)
                .body(buildErrorResponse(403, "Forbidden", ex.getMessage(), request.getRequestURI(), null));
    }

    /** 400 — bad arguments (e.g. file validation in Lab 8). */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex,
                                                               HttpServletRequest request) {
        return ResponseEntity.badRequest()
                .body(buildErrorResponse(400, "Bad Request", ex.getMessage(), request.getRequestURI(), null));
    }

    private ErrorResponse buildErrorResponse(int status, String error, String message,
                                             String path, Map<String, String> validationErrors) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .error(error)
                .message(message)
                .path(path)
                .validationErrors(validationErrors)
                .build();
    }
}
