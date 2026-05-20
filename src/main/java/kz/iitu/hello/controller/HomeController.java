package kz.iitu.hello.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Lab 1 — MVC controller. Unlike {@code @RestController}, a returned String here is a
 * <b>view name</b>: {@code "index"} resolves to {@code templates/index.html} (Thymeleaf).
 */
@Controller
public class HomeController {

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("appName", "University Management Application");
        model.addAttribute("docsUrl", "/swagger-ui.html");
        return "index";
    }
}
