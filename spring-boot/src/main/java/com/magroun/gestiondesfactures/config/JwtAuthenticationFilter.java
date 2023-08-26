package com.magroun.gestiondesfactures.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import java.beans.Transient;
import java.io.IOException;
import java.security.Security;

import jakarta.transaction.TransactionScoped;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.magroun.gestiondesfactures.repository.TokenRepository;
import com.magroun.gestiondesfactures.service.JwtService;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;
  private final TokenRepository tokenRepository;

  @Override
  protected void doFilterInternal(
          @NonNull HttpServletRequest request,
          @NonNull HttpServletResponse response,
          @NonNull FilterChain filterChain
  ) throws ServletException, IOException {
      if (request.getServletPath().contains("/api/v1/auth")) {
          filterChain.doFilter(request, response);
          return;
      }

      String jwt = null;
      Cookie[] cookies = request.getCookies();
      if (cookies != null) {
          for (Cookie cookie : cookies) {
              if ("access_token".equals(cookie.getName())) {
                  jwt = cookie.getValue();
                  System.out.println("JWT Token: " + jwt);
                  break;
              }
          }
      }

      if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
          String userEmail = jwtService.extractUsername(jwt);
          System.out.println(userEmail);
          UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
          boolean isTokenValid = tokenRepository.findByToken(jwt)
                  .map(t -> !t.isExpired() && !t.isRevoked())
                  .orElse(false);
          System.out.println(isTokenValid);
          if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
              UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                      userDetails,
                      null,
                      userDetails.getAuthorities()
              );
              authToken.setDetails(
                      new WebAuthenticationDetailsSource().buildDetails(request)
              );
              SecurityContextHolder.getContext().setAuthentication(authToken);
          }
      }

      filterChain.doFilter(request, response);
  }
}