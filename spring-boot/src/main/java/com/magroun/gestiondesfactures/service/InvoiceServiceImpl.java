package com.magroun.gestiondesfactures.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.magroun.gestiondesfactures.model.Invoice;
import com.magroun.gestiondesfactures.model.LineItem;
import com.magroun.gestiondesfactures.repository.InvoiceRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final LineItemService lineItemService;

    @Autowired
    public InvoiceServiceImpl(InvoiceRepository invoiceRepository, LineItemService lineItemService) {
        this.invoiceRepository = invoiceRepository;
        this.lineItemService = lineItemService;
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
    @Transactional
    public Invoice updateInvoice(Long id, Invoice updatedInvoice) {
        Optional<Invoice> existingInvoiceOptional = invoiceRepository.findById(id);

        if (existingInvoiceOptional.isPresent()) {
            Invoice existingInvoice = existingInvoiceOptional.get();

            existingInvoice.setDateIssued(updatedInvoice.getDateIssued());
            existingInvoice.setDueDate(updatedInvoice.getDueDate());
            existingInvoice.setTotalAmount(updatedInvoice.getTotalAmount());

            List<LineItem> updatedLineItems = updatedInvoice.getLineItems();
            
            for (LineItem lineItem : updatedLineItems) {
                System.out.println("LineItem ID: " + lineItem.getId());
            }

            Set<Long> updatedLineItemIds = updatedLineItems.stream()
                    .map(LineItem::getId)
                    .collect(Collectors.toSet());

            existingInvoice.getLineItems().removeIf(existingLineItem ->
                    !updatedLineItemIds.contains(existingLineItem.getId()));

            List<LineItem> lineItemsToDelete = existingInvoice.getLineItems().stream()
                    .filter(existingLineItem -> !updatedLineItemIds.contains(existingLineItem.getId()))
                    .collect(Collectors.toList());

            for (LineItem lineItem : lineItemsToDelete) {
                lineItemService.deleteLineItem(lineItem.getId());
            }

            for (LineItem updatedLineItem : updatedLineItems) {
                if (updatedLineItem.getId() != null) {
                    boolean existsInExistingInvoice = existingInvoice.getLineItems().stream()
                            .filter(existingLineItem -> existingLineItem.getId() != null)
                            .anyMatch(existingLineItem -> existingLineItem.getId().equals(updatedLineItem.getId()));

                    if (existsInExistingInvoice) {
                        for (LineItem existingLineItem : existingInvoice.getLineItems()) {
                            if (existingLineItem.getId() != null && existingLineItem.getId().equals(updatedLineItem.getId())) {
                                existingLineItem.setProduct(updatedLineItem.getProduct());
                                // ... update other fields as needed ...
                                break;
                            }
                        }
                    } else {
                        LineItem newLineItem = new LineItem();
                        newLineItem.setId(updatedLineItem.getId());
                        newLineItem.setProduct(updatedLineItem.getProduct());
            
                        existingInvoice.getLineItems().add(newLineItem);
                    }
                } else {
                    LineItem newLineItem = new LineItem();
                    newLineItem.setProduct(updatedLineItem.getProduct());
      
                    existingInvoice.getLineItems().add(newLineItem);
                }
            }

            Invoice savedInvoice = invoiceRepository.save(existingInvoice);
            return savedInvoice;
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

