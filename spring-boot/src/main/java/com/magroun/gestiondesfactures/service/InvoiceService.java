package com.magroun.gestiondesfactures.service;

import java.util.List;

import com.magroun.gestiondesfactures.model.Invoice;

public interface InvoiceService {
    Invoice createInvoice(Invoice invoice);
    List<Invoice> getAllInvoices();
    Invoice getInvoiceById(Long id);
    void deleteInvoice(Long id);
 
}

