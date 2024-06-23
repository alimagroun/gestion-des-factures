package com.magroun.gestiondesfactures.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;


import com.magroun.gestiondesfactures.dto.SettingsResponse;
import com.magroun.gestiondesfactures.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
	
	private final UserService userService;
	
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/settings")
    public ResponseEntity<SettingsResponse> getUserSettings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); 
        
        SettingsResponse settings = userService.getSettings(email);
        
        if (settings != null) {
            return new ResponseEntity<>(settings, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PostMapping("/update-settings")
    public ResponseEntity<SettingsResponse> updateSettings(@RequestBody SettingsResponse settingsResponse) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        SettingsResponse updatedSettings = userService.updateSettings(email, settingsResponse);
        if (updatedSettings != null) {
            return ResponseEntity.ok(updatedSettings);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
