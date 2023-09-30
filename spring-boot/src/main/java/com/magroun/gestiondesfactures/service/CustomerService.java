package com.magroun.gestiondesfactures.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.model.Customer;

public interface CustomerService {
    Customer createCustomer(Customer customer);
    Page<Customer> getAllCustomers(Pageable pageable); // Updated to return Page<Customer>
    Customer getCustomerById(Long id);
    Customer updateCustomer(Long id, Customer updatedCustomer);
    void deleteCustomer(Long id);
}
