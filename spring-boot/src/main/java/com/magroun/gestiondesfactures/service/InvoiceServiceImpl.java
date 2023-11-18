package com.magroun.gestiondesfactures.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.magroun.gestiondesfactures.model.Invoice;
import com.magroun.gestiondesfactures.model.LineItem;
import com.magroun.gestiondesfactures.repository.InvoiceRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;

    @Autowired
    public InvoiceServiceImpl(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        String generatedInvoiceNumber = generateInvoiceNumber();
        invoice.setInvoiceNumber(generatedInvoiceNumber);
        
        List<LineItem> lineItems = invoice.getLineItems();
        if (lineItems != null) {
            for (LineItem lineItem : lineItems) {
                lineItem.setInvoice(invoice);
            }
        }

        return invoiceRepository.save(invoice);
    }

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id).orElse(null);
    }
    
    @Override
    public Invoice updateInvoice(Long id, Invoice updatedInvoice) {
        Optional<Invoice> existingInvoiceOptional = invoiceRepository.findById(id);

        if (existingInvoiceOptional.isPresent()) {
            Invoice existingInvoice = existingInvoiceOptional.get();

            existingInvoice.setInvoiceNumber(updatedInvoice.getInvoiceNumber());
            existingInvoice.setDateIssued(updatedInvoice.getDateIssued());
            existingInvoice.setDueDate(updatedInvoice.getDueDate());
            existingInvoice.setTotalAmount(updatedInvoice.getTotalAmount());

            invoiceRepository.save(existingInvoice);
            
            return existingInvoice;
        } else {
            return null;
        }
    }

    @Override
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
    
    @Override
    public String generateInvoiceNumber() {
        // Get the last used invoice number for the current year
        int currentYear = LocalDate.now().getYear() % 100;
        Integer lastInvoiceNumber = invoiceRepository.findLastInvoiceNumberByYear(String.format("%02d", currentYear));

        // If no invoice number is found for the current year, start with 1
        if (lastInvoiceNumber == null) {
            lastInvoiceNumber = 0;
        }

        // Increment the last invoice number
        int newInvoiceNumber = lastInvoiceNumber + 1;

        // Format the invoice number
        String formattedInvoiceNumber = String.format("%02d%06d", currentYear, newInvoiceNumber);

        return formattedInvoiceNumber;
    }
}

