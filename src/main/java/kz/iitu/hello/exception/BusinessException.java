package kz.iitu.hello.exception;

/**
 * Lab 5 — thrown when an operation is rejected by a business rule
 * (e.g. deleting a teacher who still has courses). Mapped to HTTP 409 Conflict.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
