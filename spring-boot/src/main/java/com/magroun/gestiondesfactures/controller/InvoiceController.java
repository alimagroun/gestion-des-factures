package com.magroun.gestiondesfactures.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.magroun.gestiondesfactures.model.Invoice;
import com.magroun.gestiondesfactures.service.InvoiceService;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ResponseEntity<Page<Invoice>> getAllInvoices(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
    	Pageable pageable = PageRequest.of(page, size);
    	Page<Invoice> invoices = invoiceService.getAllInvoices(pageable);
        return new ResponseEntity<>(invoices, HttpStatus.OK);
    }
    
    @GetMapping("/quotes")
    public ResponseEntity<Page<Invoice>> getAllQuotes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
    	Pageable pageable = PageRequest.of(page, size);
    	Page<Invoice> invoices = invoiceService.getAllQuotes(pageable);
        return new ResponseEntity<>(invoices, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        if (invoice != null) {
            return new ResponseEntity<>(invoice, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        Invoice createdInvoice = invoiceService.createInvoice(invoice);
        return new ResponseEntity<>(createdInvoice, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoice) {
        Invoice updatedInvoice = invoiceService.updateInvoice(id, invoice);
        if (updatedInvoice != null) {
            return new ResponseEntity<>(updatedInvoice, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        try {
            invoiceService.deleteInvoice(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (EmptyResultDataAccessException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}