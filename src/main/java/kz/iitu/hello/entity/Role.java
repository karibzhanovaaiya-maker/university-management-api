package kz.iitu.hello.entity;

/**
 * Application roles. Stored as a string in the {@code users.role} column.
 * Spring Security maps these to authorities {@code ROLE_ADMIN}, {@code ROLE_TEACHER}, etc.
 */
public enum Role {
    ADMIN,
    TEACHER,
    STUDENT,
    USER
}
