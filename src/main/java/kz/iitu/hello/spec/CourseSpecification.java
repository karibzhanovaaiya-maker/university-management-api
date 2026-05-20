package kz.iitu.hello.spec;

import kz.iitu.hello.dto.CourseSearchForm;
import kz.iitu.hello.entity.Course;
import org.springframework.data.jpa.domain.Specification;

/**
 * Lab 6 — builds a dynamic {@code WHERE} from the optional filter fields.
 *
 * <p>Start from {@code conjunction()} (always-true). Each non-null/non-blank filter
 * AND-s a predicate on. If every field is empty the result is effectively
 * {@code WHERE 1=1}, i.e. all rows.
 */
public final class CourseSpecification {

    private CourseSpecification() {
    }

    public static Specification<Course> withFilters(CourseSearchForm form) {
        return (root, query, cb) -> {
            var predicate = cb.conjunction();

            if (form.getCourseName() != null && !form.getCourseName().isBlank()) {
                predicate = cb.and(predicate,
                        cb.like(cb.lower(root.get("courseName")),
                                "%" + form.getCourseName().toLowerCase() + "%"));
            }

            if (form.getExactCourseName() != null && !form.getExactCourseName().isBlank()) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("courseName"), form.getExactCourseName()));
            }

            if (form.getCreditsFrom() != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(root.get("credits"), form.getCreditsFrom()));
            }
            if (form.getCreditsTo() != null) {
                predicate = cb.and(predicate,
                        cb.lessThanOrEqualTo(root.get("credits"), form.getCreditsTo()));
            }

            if (form.getMaxStudentsFrom() != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(root.get("maxStudents"), form.getMaxStudentsFrom()));
            }
            if (form.getMaxStudentsTo() != null) {
                predicate = cb.and(predicate,
                        cb.lessThanOrEqualTo(root.get("maxStudents"), form.getMaxStudentsTo()));
            }

            if (form.getTeacherId() != null) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("teacher").get("id"), form.getTeacherId()));
            }

            return predicate;
        };
    }
}
