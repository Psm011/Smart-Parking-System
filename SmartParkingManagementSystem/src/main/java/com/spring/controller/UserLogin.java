package com.spring.controller;

import com.spring.entities.User;
import com.spring.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class UserLogin {

    @Autowired
    private UserRepository userRepository;
    
 // Admin Login Page
    @GetMapping("/adminlogin")
    public String showAdminLoginForm(HttpServletResponse response) {
        // Prevent browser caching of the login page
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        return "AdminLogin";  // Thymeleaf template for admin login
    }

    // Process Admin Login
    @PostMapping("/adminlogin")
    public String processAdminLogin(@RequestParam("email") String email,
                                    @RequestParam("password") String password,
                                    RedirectAttributes redirectAttributes,
                                    HttpSession session) {
        // Admin authentication logic
        if (email.equals("pranavmane@gmail.com") && password.equals("admin123")) {
            // Store admin details in session
            session.setAttribute("adminEmail", email);
            session.setAttribute("adminRole", "ADMIN");

            // Successful login
            redirectAttributes.addFlashAttribute("success", "Welcome, Admin!");
            return "redirect:/admin-dashboard"; // Redirect to Admin Dashboard
        }

        // Invalid credentials
        redirectAttributes.addFlashAttribute("error", "Invalid admin credentials.");
        return "redirect:/adminlogin"; // Redirect back to admin login page
    }

    // Admin Dashboard
    @GetMapping("/admin-dashboard")
    public String adminDashboard(HttpSession session, Model model, HttpServletResponse response) {
        // Prevent browser caching
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        // Check if admin is logged in
        String adminEmail = (String) session.getAttribute("adminEmail");
        if (adminEmail == null) {
            return "redirect:/adminlogin"; // Redirect to admin login if session is invalid
        }

        // Add admin details to the model
        model.addAttribute("adminEmail", adminEmail);
        return "AdminDashboard"; // Thymeleaf view for Admin Dashboard
    }
    
    //user login
    @GetMapping("/login")
    public String showLoginForm(HttpServletResponse response) {
        // Prevent browser caching of the login page
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        return "userlogin";  // Thymeleaf template for login
    }
    @PostMapping("/login")
    public String processLogin(@RequestParam("email") String email,
                               @RequestParam("password") String password,
                               RedirectAttributes redirectAttributes,
                               HttpSession session) {
        // Check if the user exists by email
        User user = userRepository.findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) {
            redirectAttributes.addFlashAttribute("error", "Invalid email or password");
            return "redirect:/login"; // Redirect back to login page with error
        }

        // Store the user's email and name in the session
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userFullName", user.getFullName());
        session.setAttribute("userMobile", user.getPhoneNumber());
        // Log session details for debugging
        System.out.println("User logged in: " + user.getEmail());
        System.out.println("Session ID: " + session.getId());

        // Successful login
        redirectAttributes.addFlashAttribute("success", "Welcome, " + user.getFullName());
        return "redirect:/user-dashboard"; // Redirect to UserDashboard page
    }

    // Logout for both User and Admin
    @RequestMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        // Invalidate the session
        session.invalidate();

        // Add a logout message
        redirectAttributes.addFlashAttribute("success", "You have successfully logged out.");
        return "redirect:/login"; // Redirect to user login page
    }

    @GetMapping("/user-dashboard")
    public String userDashboard(HttpSession session, Model model, HttpServletResponse response) {
        // Prevent browser caching of the user-dashboard page
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        // Check if the user is logged in by checking session attributes
        String userFullName = (String) session.getAttribute("userFullName");
        
        // If the user is not logged in, redirect to the login page
        if (userFullName == null) {
            return "redirect:/login"; // Redirect to login if session is invalid
        }

        // Add userFullName to the model for the dashboard view
        model.addAttribute("userFullName", userFullName);
        return "UserDashboard"; // Return the user-dashboard view
    }
    

}
