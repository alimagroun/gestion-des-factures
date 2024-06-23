package com.magroun.gestiondesfactures.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.magroun.gestiondesfactures.model.Invoice;

public interface InvoiceService {
    Invoice createInvoice(Invoice invoice);
    Page<Invoice> getAllInvoices(Pageable pageable);
    Page<Invoice> getAllQuotes(Pageable pageable);
    Invoice getInvoiceById(Long id);
    Invoice updateInvoice(Long id, Invoice updatedInvoice);
    void deleteInvoice(Long id);
}

