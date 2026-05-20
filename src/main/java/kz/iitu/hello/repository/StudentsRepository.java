package kz.iitu.hello.repository;

import kz.iitu.hello.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface StudentsRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    boolean existsByUserId(Long userId);
}
