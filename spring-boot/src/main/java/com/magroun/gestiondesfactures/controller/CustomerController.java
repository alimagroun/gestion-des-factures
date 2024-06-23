package com.magroun.gestiondesfactures.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.dto.CustomerCreationRequest;
import com.magroun.gestiondesfactures.model.Customer;
import com.magroun.gestiondesfactures.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody CustomerCreationRequest request) {
        Customer createdCustomer = customerService.createCustomer(request);
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        if (customer != null) {
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<Page<Customer>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Customer> customers = customerService.getAllCustomers(pageable);

        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long customerId, @RequestBody CustomerCreationRequest updatedCustomerRequest) {
        Customer updatedCustomerEntity = customerService.updateCustomer(customerId, updatedCustomerRequest);

        if (updatedCustomerEntity != null) {
            return new ResponseEntity<>(updatedCustomerEntity, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long customerId) {
        customerService.deleteCustomer(customerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomersByPrefix(@RequestParam("prefix") String prefix) {
        List<Customer> customers = customerService.findCustomersByPrefix(prefix);
        if (customers.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(customers);
        }
    }
    
    @GetMapping("/findSingleCustomer")
    public ResponseEntity<Customer> findSingleCustomer(@RequestParam("prefix") String prefix) {
        Customer customer = customerService.findSingleCustomerByPrefix(prefix);

        if (customer != null) {
            return ResponseEntity.ok(customer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}

