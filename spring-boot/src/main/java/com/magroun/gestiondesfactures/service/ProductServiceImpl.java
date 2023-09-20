package com.magroun.gestiondesfactures.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.model.Product;
import com.magroun.gestiondesfactures.repository.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
    
    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        Optional<Product> existingProductOptional = productRepository.findById(id);

        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();
            existingProduct.setReference(updatedProduct.getReference());
            existingProduct.setDesignation(updatedProduct.getDesignation());
            existingProduct.setPurchasePrice(updatedProduct.getPurchasePrice());
            existingProduct.setSellingPrice(updatedProduct.getSellingPrice());
            existingProduct.setProfitMargin(updatedProduct.getProfitMargin());
            existingProduct.setTax(updatedProduct.getTax());
     //       existingProduct.setLastUpdate(updatedProduct.getLastUpdate());
                            
            productRepository.save(existingProduct);
            return existingProduct;
        } else {
            return null;
        }
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

}

