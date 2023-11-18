package com.magroun.gestiondesfactures.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.magroun.gestiondesfactures.model.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
	
    @Query(value = "SELECT MAX(SUBSTRING(in.invoiceNumber, 3)) FROM Invoice in WHERE SUBSTRING(in.invoiceNumber, 1, 2) = :year")
    Integer findLastInvoiceNumberByYear(String year);
  
}

