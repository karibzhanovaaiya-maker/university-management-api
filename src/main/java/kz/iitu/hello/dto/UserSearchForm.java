package kz.iitu.hello.dto;

import kz.iitu.hello.entity.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Lab 6 — filters for the paginated user search. */
@Getter
@Setter
@NoArgsConstructor
public class UserSearchForm {

    private String userName;
    private String email;
    private Role role;
}
