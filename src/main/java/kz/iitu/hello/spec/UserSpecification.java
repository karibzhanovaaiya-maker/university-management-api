package kz.iitu.hello.spec;

import kz.iitu.hello.dto.UserSearchForm;
import kz.iitu.hello.entity.User;
import org.springframework.data.jpa.domain.Specification;

/** Lab 6 — dynamic filters for the user search. */
public final class UserSpecification {

    private UserSpecification() {
    }

    public static Specification<User> withFilters(UserSearchForm form) {
        return (root, query, cb) -> {
            var predicate = cb.conjunction();

            if (form.getUserName() != null && !form.getUserName().isBlank()) {
                predicate = cb.and(predicate,
                        cb.like(cb.lower(root.get("userName")),
                                "%" + form.getUserName().toLowerCase() + "%"));
            }
            if (form.getEmail() != null && !form.getEmail().isBlank()) {
                predicate = cb.and(predicate,
                        cb.like(cb.lower(root.get("email")),
                                "%" + form.getEmail().toLowerCase() + "%"));
            }
            if (form.getRole() != null) {
                predicate = cb.and(predicate, cb.equal(root.get("role"), form.getRole()));
            }

            return predicate;
        };
    }
}
