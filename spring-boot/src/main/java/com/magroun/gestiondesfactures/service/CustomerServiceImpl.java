package com.magroun.gestiondesfactures.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.magroun.gestiondesfactures.model.Customer;
import com.magroun.gestiondesfactures.dto.CustomerCreationRequest;
import com.magroun.gestiondesfactures.model.Address;
import com.magroun.gestiondesfactures.repository.AddressRepository;
import com.magroun.gestiondesfactures.repository.CustomerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
        @Autowired
        private AddressRepository addressRepository;

        public Customer createCustomer(CustomerCreationRequest request) {
            Customer customer = new Customer();
            customer.setFirstName(request.getFirstName());
            customer.setLastName(request.getLastName());
            customer.setEmail(request.getEmail());
            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setCompanyName(request.getCompanyName());
            customer.setTaxIdentificationNumber(request.getTaxIdentificationNumber());

            if (request.getStreetAddress() != null || request.getCity() != null ||
                request.getState() != null || request.getPostalCode() != null) {
                Address address = new Address();
                address.setStreetAddress(request.getStreetAddress());
                address.setCity(request.getCity());
                address.setState(request.getState());
                address.setPostalCode(request.getPostalCode());
                
                addressRepository.save(address);
                
                customer.setAddress(address);
            }

            return customerRepository.save(customer);
        }
    
    @Override
    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }
    
    @Override
    public Customer updateCustomer(Long id, CustomerCreationRequest updatedCustomer) {
        Optional<Customer> existingCustomerOptional = customerRepository.findById(id);

        if (existingCustomerOptional.isPresent()) {
            Customer existingCustomer = existingCustomerOptional.get();

            existingCustomer.setFirstName(updatedCustomer.getFirstName());
            existingCustomer.setLastName(updatedCustomer.getLastName());
            existingCustomer.setEmail(updatedCustomer.getEmail());
            existingCustomer.setPhoneNumber(updatedCustomer.getPhoneNumber());

            if (updatedCustomer.getStreetAddress() != null || updatedCustomer.getCity() != null ||
                updatedCustomer.getState() != null || updatedCustomer.getPostalCode() != null) {
                Address updatedAddress = new Address();
                updatedAddress.setStreetAddress(updatedCustomer.getStreetAddress());
                updatedAddress.setCity(updatedCustomer.getCity());
                updatedAddress.setState(updatedCustomer.getState());
                updatedAddress.setPostalCode(updatedCustomer.getPostalCode());

                existingCustomer.setAddress(updatedAddress);
            }

            return customerRepository.save(existingCustomer);
        } else {
            return null;
        }
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
    
    @Override
    public List<Customer> findCustomersByPrefix(String prefix) {
        return customerRepository.findByPrefix(prefix);
    }

    @Override
    public Customer findSingleCustomerByPrefix(String prefix) {
        return customerRepository.findSingleCustomerByPrefix(prefix);
    }

}