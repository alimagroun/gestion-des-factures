package com.magroun.gestiondesfactures.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.model.Product;

public interface ProductService {
    Product createProduct(Product product);
    Page<Product> getAllProducts(Pageable pageable);
    Product getProductById(Long id);
    Product updateProduct(Long id, Product updatedProduct);
    void deleteProduct(Long id);
    Page<Product> findProductsByPrefix(String prefix, Pageable pageable);
    Long findProductIdByDesignation(String designation);
}

