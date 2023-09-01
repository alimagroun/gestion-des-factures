package com.magroun.gestiondesfactures.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.magroun.gestiondesfactures.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
 
}

