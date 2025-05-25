package com.spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.entities.User;
import com.spring.repository.UserRepository;

@RestController // Use RestController to expose REST API
@RequestMapping("/api/users-management")
public class UserManagement {

    @Autowired
    private UserRepository userrepos; // Autowired to inject UserRepository

    // API to get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userrepos.findAll(); // Fetch all users
        return ResponseEntity.ok(users); // Return the list as JSON
    }
    // API to delete a user by email
    @DeleteMapping("/users/{email}") // Correct path variable syntax
    public ResponseEntity<Void> deleteUser(@PathVariable String email) {
        User user = userrepos.findByEmail(email); // Find user by email
        if (user != null) {
            userrepos.delete(user); // Delete the user from repository
            return ResponseEntity.noContent().build(); // Return HTTP 204 No Content on success
        } else {
            return ResponseEntity.notFound().build(); // Return HTTP 404 if user not found
        }
    }
    // API to fetch the total number of vehicles
    @GetMapping("/total-vehicles")
    public ResponseEntity<Long> getTotalVehicles() {
        Long totalVehicles = userrepos.count();
        return ResponseEntity.ok(totalVehicles);
    }

    // API to fetch the total number of vehicle owners
    @GetMapping("/total-vehicle-owners")
    public ResponseEntity<Long> getTotalVehicleOwners() {
        Long totalVehicleOwners = userrepos.count();
        return ResponseEntity.ok(totalVehicleOwners);
    }
}
