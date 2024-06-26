package com.magroun.gestiondesfactures.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magroun.gestiondesfactures.dto.AuthenticationRequest;
import com.magroun.gestiondesfactures.dto.AuthenticationResponse;
import com.magroun.gestiondesfactures.dto.RegisterRequest;
import com.magroun.gestiondesfactures.model.Token;
import com.magroun.gestiondesfactures.model.TokenType;
import com.magroun.gestiondesfactures.model.User;
import com.magroun.gestiondesfactures.repository.TokenRepository;
import com.magroun.gestiondesfactures.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository repository;
  private final TokenRepository tokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public ResponseCookie register(RegisterRequest request, HttpServletResponse response) {
      var user = User.builder()
          .firstname(request.getFirstname())
          .lastname(request.getLastname())
          .email(request.getEmail())
          .password(passwordEncoder.encode(request.getPassword()))
          .role(request.getRole())
          .build();
      var savedUser = repository.save(user);
      var jwtToken = jwtService.generateToken(user);
      var refreshToken = jwtService.generateRefreshToken(user);

      ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", jwtToken)
          .httpOnly(true)
          .secure(false)   
          .path("/api")      
          .maxAge(24 * 60 * 60) 
          .build();
      response.addHeader("Set-Cookie", accessTokenCookie.toString());

      ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refreshToken)
          .httpOnly(true)
          .secure(false)  
          .path("/api")     
          .maxAge(24 * 60 * 60) 
          .build();
      response.addHeader("Set-Cookie", refreshTokenCookie.toString());
      TokenType tokenTypeAccess = TokenType.ACCESS;
      saveUserToken(user, jwtToken, tokenTypeAccess);
      TokenType tokenTypeRefresh = TokenType.REFRESH;
      saveUserToken(user, refreshToken, tokenTypeRefresh);
      return accessTokenCookie; 
  }

  public ResponseCookie authenticate(AuthenticationRequest request, HttpServletResponse response) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()
        )
    );
    var user = repository.findByEmail(request.getEmail())
        .orElseThrow();
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    revokeAllUserTokens(user);
    TokenType tokenTypeAccess = TokenType.ACCESS;
    saveUserToken(user, jwtToken, tokenTypeAccess);
    TokenType tokenTypeRefresh = TokenType.REFRESH;
    saveUserToken(user, refreshToken, tokenTypeRefresh);

    ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", jwtToken)
            .httpOnly(true)
            .secure(false)   
            .path("/api")      
            .maxAge(24 * 60 * 60) 
            .build();
        response.addHeader("Set-Cookie", accessTokenCookie.toString());

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true)
            .secure(false)  
            .path("/api")     
            .maxAge(7* 24 * 60 * 60) 
            .build();
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());
        return accessTokenCookie; 
  }

  private void saveUserToken(User user, String jwtToken, TokenType tokenType) {
	    var token = Token.builder()
	        .user(user)
	        .token(jwtToken)
	        .tokenType(tokenType)
	        .expired(false)
	        .revoked(false)
	        .build();
	    tokenRepository.save(token);
	}

  private void revokeAllUserTokens(User user) {
    var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
    if (validUserTokens.isEmpty())
      return;
    validUserTokens.forEach(token -> {
      token.setExpired(true);
      token.setRevoked(true);
    });
    tokenRepository.saveAll(validUserTokens);
  }

  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
      return;
    }
    refreshToken = authHeader.substring(7);
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var user = this.repository.findByEmail(userEmail)
              .orElseThrow();
      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken, TokenType.ACCESS);
        var authResponse = AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }
   
}
