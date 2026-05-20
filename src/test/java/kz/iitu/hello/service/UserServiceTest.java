package kz.iitu.hello.service;

import jakarta.persistence.EntityNotFoundException;
import kz.iitu.hello.dto.UserFormDto;
import kz.iitu.hello.dto.UserSearchForm;
import kz.iitu.hello.entity.Role;
import kz.iitu.hello.entity.User;
import kz.iitu.hello.repository.UsersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UsersRepository usersRepository;
    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void findById_whenMissing_throwsEntityNotFoundException() {
        when(usersRepository.findById(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(7L))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void create_encodesPasswordBeforeSaving() {
        UserFormDto form = new UserFormDto();
        form.setUserName("bob");
        form.setEmail("bob@university.kz");
        form.setPassword("secret123");
        form.setRole(Role.USER);

        when(passwordEncoder.encode("secret123")).thenReturn("ENCODED");
        when(usersRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User created = userService.create(form);

        assertThat(created.getPassword()).isEqualTo("ENCODED");
        assertThat(created.getUserName()).isEqualTo("bob");
    }

    /** Lab 6 — an unknown/unsafe sort field must fall back to the default ("id"). */
    @Test
    @SuppressWarnings("unchecked")
    void search_withUnknownSortField_fallsBackToDefaultSort() {
        when(usersRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(Page.empty());

        userService.search(new UserSearchForm(), 0, 10, "DROP TABLE users", "asc");

        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        verify(usersRepository).findAll(any(Specification.class), captor.capture());
        assertThat(captor.getValue().getSort().getOrderFor("id")).isNotNull();
        assertThat(captor.getValue().getSort().getOrderFor("DROP TABLE users")).isNull();
    }
}
