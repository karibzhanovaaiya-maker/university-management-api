package kz.iitu.hello.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lab 1 — REST controller. {@code @RestController} = {@code @Controller} + {@code @ResponseBody},
 * so a returned String is written straight into the HTTP body (not resolved as a view).
 */
@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello!";
    }

    /**
     * Lab 1 drill — name from the path, optional {@code lang} (default "en"),
     * e.g. {@code GET /hello/Alice?lang=ru} -> {@code "Hello, Alice (ru)"}.
     */
    @GetMapping("/hello/{name}")
    public String hello(@PathVariable String name,
                        @RequestParam(defaultValue = "en") String lang) {
        return "Hello, " + name + " (" + lang + ")";
    }

    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is a public endpoint — no token required.";
    }
}
