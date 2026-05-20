package kz.iitu.hello.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kz.iitu.hello.dto.AuthResponse;
import kz.iitu.hello.dto.LoginRequest;
import kz.iitu.hello.dto.RegisterRequest;
import kz.iitu.hello.entity.Role;
import kz.iitu.hello.entity.User;
import kz.iitu.hello.exception.BusinessException;
import kz.iitu.hello.security.JwtUtil;
import kz.iitu.hello.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Lab 7 — public auth endpoints that issue JWTs. */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Register and login (public, returns a JWT)")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,
                         UserService userService,
                         JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    @Operation(summary = "Register", description = "Create a USER account and return a JWT")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        if (userService.existsByUserName(request.getUserName())) {
            throw new BusinessException("Username already taken");
        }
        User user = userService.register(
                request.getUserName(), request.getEmail(), request.getPassword(), Role.USER);
        return buildResponse(user);
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate and return a JWT")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUserName(), request.getPassword()));
        User user = userService.findByUserName(request.getUserName());
        return buildResponse(user);
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtUtil.generateToken(user.getUserName());
        return AuthResponse.builder()
                .token(token)
                .userName(user.getUserName())
                .role(user.getRole().name())
                .build();
    }
}
