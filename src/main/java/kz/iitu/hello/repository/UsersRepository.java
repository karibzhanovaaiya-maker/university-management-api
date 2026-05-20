package kz.iitu.hello.repository;

import kz.iitu.hello.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

/**
 * Lab 2 — extending {@link JpaRepository} gives free CRUD (save, findById, findAll,
 * deleteById, count, existsById, ...). Lab 6 adds {@link JpaSpecificationExecutor}
 * for dynamic queries. The remaining methods are derived from their names.
 */
public interface UsersRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByUserName(String userName);

    boolean existsByUserNameIgnoreCase(String userName);

    boolean existsByUserNameIgnoreCaseAndIdNot(String userName, Long id);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
}
