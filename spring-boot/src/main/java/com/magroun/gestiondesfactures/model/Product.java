package com.magroun.gestiondesfactures.model;

import jakarta.persistence.*;
import java.util.Date;

import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.magroun.gestiondesfactures.validation.ValidSellingPrice;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
@ValidSellingPrice
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Reference cannot be blank")
    private String reference;

    @NotBlank(message = "Designation cannot be blank")
    private String designation;

    @DecimalMin(value = "0.0", message = "Purchase price must be greater than or equal to 0.0")
    @DecimalMax(value = "9999999999999.0", message = "Purchase price cannot exceed 9,999,999,999,999.0")
    private double purchasePrice;

    @DecimalMin(value = "0.0", message = "Selling price must be greater than or equal to 0.0")
    private double sellingPrice;

    @DecimalMin(value = "0.0", message = "Profit margin must be greater than or equal to 0.0")
    @DecimalMax(value = "100.0", message = "Profit margin cannot exceed 100.0")
    private double profitMargin;

    @DecimalMin(value = "0.0", message = "Tax must be greater than or equal to 0.0")
    @DecimalMax(value = "100.0", message = "Tax cannot exceed 100.0")
    private double tax;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_update")
    @LastModifiedDate
    private Date lastUpdate;

    public Product(Long id, String reference, String designation, double purchasePrice, double sellingPrice,
			double profitMargin, double tax, Date lastUpdate) {
		super();
		this.id = id;
		this.reference = reference;
		this.designation = designation;
		this.purchasePrice = purchasePrice;
		this.sellingPrice = sellingPrice;
		this.profitMargin = profitMargin;
		this.tax = tax;
		this.lastUpdate = lastUpdate;
	}
    
	public Product() {
		super();
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public double getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(double sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public double getProfitMargin() {
        return profitMargin;
    }

    public void setProfitMargin(double profitMargin) {
        this.profitMargin = profitMargin;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public Date getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Date lastUpdate) {
        this.lastUpdate = lastUpdate;
    } 
}