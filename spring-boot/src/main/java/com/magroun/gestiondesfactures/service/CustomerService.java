package com.magroun.gestiondesfactures.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.dto.CustomerCreationRequest;
import com.magroun.gestiondesfactures.model.Customer;

public interface CustomerService {
	Customer createCustomer(CustomerCreationRequest request);
    Page<Customer> getAllCustomers(Pageable pageable);
    Customer getCustomerById(Long id);
    Customer updateCustomer(Long id, CustomerCreationRequest updatedCustomer);
    void deleteCustomer(Long id);
    Customer findSingleCustomerByPrefix(String prefix);
    List<Customer> findCustomersByPrefix(String prefix);
}
