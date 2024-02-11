package com.magroun.gestiondesfactures.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.magroun.gestiondesfactures.model.User;
import com.magroun.gestiondesfactures.model.Role;
import com.magroun.gestiondesfactures.repository.UserRepository;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if the user already exists by email
        String adminEmail = "admin@mail.com"; // Replace with the email you want to check
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            // Create a new user
            User adminUser = new User();
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode("password")); // You should encode the password
            adminUser.setRole(Role.ADMIN); // Set the role to ADMIN
            // Set other properties as needed

            // Save the user to the database
            userRepository.save(adminUser);
        }
    }
}
