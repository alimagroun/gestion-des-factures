package com.magroun.gestiondesfactures.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.ReportAsSingleViolation;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = SellingPriceValidator.class)
@Target({ElementType.TYPE}) 
@Retention(RetentionPolicy.RUNTIME)
@ReportAsSingleViolation
public @interface ValidSellingPrice {
    String message() default "Selling price must be greater than purchase price";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

