package com.magroun.gestiondesfactures.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.magroun.gestiondesfactures.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

}

