package com.magroun.gestiondesfactures.validation;

import com.magroun.gestiondesfactures.model.Product;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class SellingPriceValidator implements ConstraintValidator<ValidSellingPrice, Product> {

    @Override
    public void initialize(ValidSellingPrice constraintAnnotation) {
    }

    @Override
    public boolean isValid(Product product, ConstraintValidatorContext context) {
        if (product == null) {
            return true;
        }

        return product.getSellingPrice() > product.getPurchasePrice();
    }
}
