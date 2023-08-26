package com.magroun.gestiondesfactures.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.Cookie;


import com.magroun.gestiondesfactures.dto.AuthenticationRequest;
import com.magroun.gestiondesfactures.dto.AuthenticationResponse;
import com.magroun.gestiondesfactures.dto.RegisterRequest;
import com.magroun.gestiondesfactures.service.AuthenticationService;
import org.springframework.security.core.Authentication;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service;

  @PostMapping("/register")
  public ResponseEntity<Void> register(
      @RequestBody RegisterRequest request,
      HttpServletResponse response
  ) {
      ResponseCookie accessTokenCookie = service.register(request, response);
      return ResponseEntity.ok().build();
  }
  
  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest request
  ) {
    return ResponseEntity.ok(service.authenticate(request));
  }

  @PostMapping("/refresh-token")
  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {
    service.refreshToken(request, response);
  }

  @PostMapping("/logout7")
  public ResponseEntity<Void> logout(HttpServletResponse response) {
      // Remove the access token cookie
      Cookie accessTokenCookie = new Cookie("access_token", null);
      accessTokenCookie.setMaxAge(0); // Set the cookie's max age to zero to delete it
      accessTokenCookie.setPath("/api"); // Make sure the path matches the original cookie path
      response.addCookie(accessTokenCookie);

      // Remove the refresh token cookie
      Cookie refreshTokenCookie = new Cookie("refresh_token", null);
      refreshTokenCookie.setMaxAge(0); // Set the cookie's max age to zero to delete it
      refreshTokenCookie.setPath("/api"); // Make sure the path matches the original cookie path
      response.addCookie(refreshTokenCookie);

      // Optionally, you can perform additional actions like invalidating a session or clearing server-side tokens

      // Return a successful response with a status code (e.g., 200 OK)
      return ResponseEntity.ok().build();
  }
  

      @GetMapping("/check-login")
      public ResponseEntity<String> checkLogin(Authentication authentication) {
          if (authentication != null && authentication.isAuthenticated()) {
              // User is logged in
              return ResponseEntity.ok("You are logged in.");
          } else {
              // User is not logged in
              return ResponseEntity.ok("You are not logged in.");
          }
      }
  

  
}
