package com.magroun.gestiondesfactures.service;

import java.util.List;

import com.magroun.gestiondesfactures.model.Customer;

public interface CustomerService {
    Customer createCustomer(Customer customer);
    List<Customer> getAllCustomers();
    Customer getCustomerById(Long id);
    void updateCustomer(Customer customer);
    void deleteCustomer(Long id);
}

