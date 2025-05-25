package com.spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserDashboardController {
	@RequestMapping("/user-dashboard")
    public String showUserDashboard() {
        return "UserDashboard"; // Return the Thymeleaf template 'UserDashboard.html'
    }

}
