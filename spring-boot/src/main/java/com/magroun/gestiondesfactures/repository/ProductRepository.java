package com.magroun.gestiondesfactures.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	Page<Product> findAll(Pageable pageable);
	
	 @Query("SELECT p FROM Product p WHERE p.reference LIKE %:prefix% OR p.designation LIKE %:prefix%")
	    Page<Product> findProductsByPrefix(String prefix, Pageable pageable);

}

