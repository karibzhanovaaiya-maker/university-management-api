package kz.iitu.hello.validation;

import kz.iitu.hello.dto.UserFormDto;
import kz.iitu.hello.repository.UsersRepository;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

/**
 * Lab 4 — custom cross-field/database validation that bean annotations can't express:
 * username and email uniqueness.
 *
 * <p>The {@code currentId} parameter distinguishes create from update. On create
 * ({@code currentId == null}) we ask "does anyone have this username?". On update we
 * ask "does anyone <b>other than this user</b> have it?" — otherwise editing a user
 * without changing the username would wrongly flag it as taken (it would match itself).
 */
@Component
public class UserFormValidator {

    private final UsersRepository usersRepository;

    public UserFormValidator(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public void validate(UserFormDto form, BindingResult bindingResult, Long currentId) {
        boolean userNameTaken = currentId == null
                ? usersRepository.existsByUserNameIgnoreCase(form.getUserName())
                : usersRepository.existsByUserNameIgnoreCaseAndIdNot(form.getUserName(), currentId);
        if (userNameTaken) {
            bindingResult.rejectValue("userName", "userName.duplicate",
                    "User with this username already exists");
        }

        if (form.getEmail() != null && !form.getEmail().isBlank()) {
            boolean emailTaken = currentId == null
                    ? usersRepository.existsByEmailIgnoreCase(form.getEmail())
                    : usersRepository.existsByEmailIgnoreCaseAndIdNot(form.getEmail(), currentId);
            if (emailTaken) {
                bindingResult.rejectValue("email", "email.duplicate",
                        "User with this email already exists");
            }
        }
    }
}
