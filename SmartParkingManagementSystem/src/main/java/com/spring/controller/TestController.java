package com.spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class TestController {

    @RequestMapping("/smartparkingmanagementsystem")
    public String showHomePage() {
        return "index"; // Ensure that index.html is in src/main/resources/templates
    }
}
