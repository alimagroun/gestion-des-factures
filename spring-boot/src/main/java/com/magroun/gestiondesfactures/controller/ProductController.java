package com.magroun.gestiondesfactures.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.exception.ResourceNotFoundException;
import com.magroun.gestiondesfactures.model.Product;
import com.magroun.gestiondesfactures.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getAllProducts(pageable);

        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            throw new ResourceNotFoundException("Product with ID " + id + " not found.");
        }
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product updatedProductResponse = productService.updateProduct(id, updatedProduct);
        if (updatedProductResponse != null) {
            return new ResponseEntity<>(updatedProductResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/search")
    public Page<Product> searchProductsByPrefix(@RequestParam String prefix, Pageable pageable) {
        Page<Product> products = productService.findProductsByPrefix(prefix, pageable);

        // Print the designations of products to the console
        for (Product product : products.getContent()) {
            System.out.println("Product Designation: " + product.getDesignation());
        }

        return products;
    }
    
    @GetMapping("/findProductIdByDesignation")
    public ResponseEntity<Long> findProductIdByDesignation(@RequestParam String designation) {
        Long productId = productService.findProductIdByDesignation(designation);
        if (productId != null) {
            return ResponseEntity.ok(productId);
        }
        return ResponseEntity.notFound().build();
    }
}

