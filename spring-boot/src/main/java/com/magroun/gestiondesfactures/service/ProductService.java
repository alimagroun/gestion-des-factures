package com.magroun.gestiondesfactures.service;

import java.util.List;

import com.magroun.gestiondesfactures.model.Product;

public interface ProductService {
    Product createProduct(Product product);
    List<Product> getAllProducts();
    Product getProductById(Long id);
    void deleteProduct(Long id);

}

