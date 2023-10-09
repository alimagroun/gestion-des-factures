package com.magroun.gestiondesfactures.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmail(String email);
    Page<Customer> findAll(Pageable pageable);
    
    @Query("SELECT c FROM Customer c " +
            "WHERE c.firstName LIKE %:prefix% " +
            "OR c.lastName LIKE %:prefix% " +
            "OR c.companyName LIKE %:prefix%")
     List<Customer> findByPrefix(String prefix);
}
