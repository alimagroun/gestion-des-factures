package com.magroun.gestiondesfactures.service;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.magroun.gestiondesfactures.model.Customer;
import com.magroun.gestiondesfactures.repository.CustomerRepository;
import com.magroun.gestiondesfactures.util.ExcelHelper;

@Service
public class ExcelService {
	
  @Autowired
  private CustomerRepository customerRepository;

  public ByteArrayInputStream load() {
    List<Customer> customers = customerRepository.findAll();

    ByteArrayInputStream in = ExcelHelper.tutorialsToExcel(customers);
    return in;
  }

}
