package kz.iitu.hello.exception;

import java.util.Map;

/**
 * Lab 4/5 — raised by custom (non-annotation) validators such as
 * {@code UserFormValidator}. Carries per-field messages and is mapped to 400
 * with the same body shape as bean-validation failures.
 */
public class ValidationException extends RuntimeException {

    private final transient Map<String, String> errors;

    public ValidationException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
