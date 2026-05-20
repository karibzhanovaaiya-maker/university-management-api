package kz.iitu.hello.repository;

import kz.iitu.hello.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Lab 6 — {@link JpaSpecificationExecutor} enables {@code findAll(Specification, Pageable)}
 * used by the filter/sort/paginate search.
 */
public interface CoursesRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {
}
