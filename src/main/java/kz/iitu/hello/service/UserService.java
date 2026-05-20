package kz.iitu.hello.service;

import jakarta.persistence.EntityNotFoundException;
import kz.iitu.hello.dto.UserFormDto;
import kz.iitu.hello.dto.UserSearchForm;
import kz.iitu.hello.entity.Role;
import kz.iitu.hello.entity.User;
import kz.iitu.hello.repository.UsersRepository;
import kz.iitu.hello.spec.UserSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class UserService {

    /** Lab 6 — whitelist of columns allowed in ORDER BY (prevents injection / bad input). */
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "userName", "email", "createdAt", "role");
    private static final String DEFAULT_SORT = "id";

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Lab 2 — throws instead of returning null. */
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return usersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public User findByUserName(String userName) {
        return usersRepository.findByUserName(userName)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userName));
    }

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return usersRepository.findAll();
    }

    @Transactional
    public User create(UserFormDto form) {
        User user = User.builder()
                .userName(form.getUserName())
                .email(form.getEmail())
                .password(passwordEncoder.encode(form.getPassword()))
                .role(form.getRole())
                .build();
        return usersRepository.save(user);
    }

    @Transactional
    public User update(Long id, UserFormDto form) {
        User user = findById(id);
        user.setUserName(form.getUserName());
        user.setEmail(form.getEmail());
        if (form.getPassword() != null && !form.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(form.getPassword()));
        }
        user.setRole(form.getRole());
        return usersRepository.save(user);
    }

    @Transactional
    public void delete(Long id) {
        if (!usersRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        usersRepository.deleteById(id);
    }

    /** Lab 6 — dynamic filter + safe sort + pagination. */
    @Transactional(readOnly = true)
    public Page<User> search(UserSearchForm form, int page, int size,
                             String requestedSortBy, String direction) {
        String sortBy = ALLOWED_SORT_FIELDS.contains(requestedSortBy) ? requestedSortBy : DEFAULT_SORT;
        Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
        return usersRepository.findAll(UserSpecification.withFilters(form), pageable);
    }

    /** Lab 7 — used by registration; encodes the raw password. */
    @Transactional
    public User register(String userName, String email, String rawPassword, Role role) {
        User user = User.builder()
                .userName(userName)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .build();
        return usersRepository.save(user);
    }

    @Transactional(readOnly = true)
    public boolean existsByUserName(String userName) {
        return usersRepository.existsByUserNameIgnoreCase(userName);
    }
}
