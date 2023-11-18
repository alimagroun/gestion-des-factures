package com.magroun.gestiondesfactures.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "line_items")
public class LineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @DecimalMin(value = "0.0", message = "Selling price must be greater than or equal to 0.0")
    private double unitPrice;
    @Min(value = 0, message = "Discount percentage must be at least 0")
    @Max(value = 100, message = "Discount percentage must be at most 100")
    private float discountPercentage;
    private int quantity;
    private double subtotal;
    @DecimalMin(value = "0.0", message = "Tax must be greater than or equal to 0.0")
    @DecimalMax(value = "100.0", message = "Tax cannot exceed 100.0")
    private float tax;

	public LineItem(Long id, Invoice invoice, Product product, double unitPrice, float discountPercentage, int quantity, double subtotal, float tax) {
		super();
		this.id = id;
		this.invoice = invoice;
		this.product = product;
		this.unitPrice = unitPrice;
		this.discountPercentage = discountPercentage;
		this.quantity = quantity;
		this.subtotal = subtotal;
		this.tax = tax;
	}

	public LineItem() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Invoice getInvoice() {
		return invoice;
	}

	public void setInvoice(Invoice invoice) {
		this.invoice = invoice;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(double unitPrice) {
		this.unitPrice = unitPrice;
	}

	public float getDiscountPercentage() {
		return discountPercentage;
	}

	public void setDiscountPercentage(float discountPercentage) {
		this.discountPercentage = discountPercentage;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(double subtotal) {
		this.subtotal = subtotal;
	}

	public float getTax() {
		return tax;
	}

	public void setTax(float tax) {
		this.tax = tax;
	}

}