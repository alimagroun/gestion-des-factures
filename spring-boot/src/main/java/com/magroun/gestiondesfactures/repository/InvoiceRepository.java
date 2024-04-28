package com.magroun.gestiondesfactures.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import com.magroun.gestiondesfactures.model.Invoice;
import com.magroun.gestiondesfactures.model.LineItem;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
	
    @Query(value = "SELECT MAX(SUBSTRING(in.invoiceNumber, 3)) FROM Invoice in WHERE SUBSTRING(in.invoiceNumber, 1, 2) = :year")
    Integer findLastInvoiceNumberByYear(String year);
    
    @Query("SELECT li FROM LineItem li WHERE li.invoice = :invoice")
    List<LineItem> getLineItemsByInvoice(@Param("invoice") Invoice invoice);
    
    Page<Invoice> findByQuoteFalse(Pageable pageable);
    
    Page<Invoice> findByQuoteTrue(Pageable pageable);
 
}

