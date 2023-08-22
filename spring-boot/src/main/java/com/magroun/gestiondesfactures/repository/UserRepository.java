package com.magroun.gestiondesfactures.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.magroun.gestiondesfactures.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByEmail(String email);
  
}
