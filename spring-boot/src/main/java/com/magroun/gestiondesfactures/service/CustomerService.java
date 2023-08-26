package com.magroun.gestiondesfactures.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.magroun.gestiondesfactures.model.Customer;
import com.magroun.gestiondesfactures.repository.CustomerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Create a new customer
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Retrieve a customer by ID
    public Optional<Customer> getCustomerById(Long customerId) {
        return customerRepository.findById(customerId);
    }

    // Retrieve all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Update an existing customer
    public Customer updateCustomer(Long customerId, Customer updatedCustomer) {
        Optional<Customer> existingCustomer = customerRepository.findById(customerId);

        if (existingCustomer.isPresent()) {
            Customer customerToUpdate = existingCustomer.get();
            customerToUpdate.setFirstName(updatedCustomer.getFirstName());
            customerToUpdate.setLastName(updatedCustomer.getLastName());
            customerToUpdate.setEmail(updatedCustomer.getEmail());
            customerToUpdate.setPhoneNumber(updatedCustomer.getPhoneNumber());

            return customerRepository.save(customerToUpdate);
        } else {
            // Customer with the given ID not found
            return null;
        }
    }

    // Delete a customer by ID
    public void deleteCustomer(Long customerId) {
        customerRepository.deleteById(customerId);
    }
}

