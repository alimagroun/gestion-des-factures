package com.magroun.gestiondesfactures.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import java.util.ArrayList;
import java.util.Iterator;

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
    public Page<Invoice> getAllInvoices(Pageable pageable) {
    	return invoiceRepository.findByQuoteFalse(pageable);
    }
    
    @Override
    public Page<Invoice> getAllQuotes(Pageable pageable) {
    	return invoiceRepository.findByQuoteTrue(pageable);
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
            existingInvoice.setCustomer(updatedInvoice.getCustomer());

            List<LineItem> updatedLineItems = updatedInvoice.getLineItems();

            if (updatedLineItems != null) {
                List<LineItem> existingLineItems = existingInvoice.getLineItems();

                for (LineItem updatedLineItem : updatedLineItems) {
                    boolean found = false;
                    if (updatedLineItem.getId() != null) {
                        for (LineItem existingLineItem : existingLineItems) {
                            if (existingLineItem.getId().equals(updatedLineItem.getId())) {
                                existingLineItem.setDiscountPercentage(updatedLineItem.getDiscountPercentage());
                                existingLineItem.setQuantity(updatedLineItem.getQuantity());
                                existingLineItem.setSubtotal(updatedLineItem.getSubtotal());
                           
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                    	updatedLineItem.setInvoice(existingInvoice);
                    	existingInvoice.getLineItems().add(updatedLineItem);
                   
                    }
                }
         
            } else {
                existingInvoice.setLineItems(new ArrayList<>());
            }

            List<LineItem> existingLineItems = existingInvoice.getLineItems();      
            Set<Long> updatedLineItemIds = updatedLineItems.stream()
                    .map(LineItem::getId)
                    .collect(Collectors.toSet());

            Iterator<LineItem> iterator = existingLineItems.iterator();
            while (iterator.hasNext()) {
                LineItem existingLineItem = iterator.next();
                if (!updatedLineItemIds.contains(existingLineItem.getId())) {
                    lineItemService.deleteLineItem(existingLineItem.getId());
                    
                    iterator.remove();
                }
            }

            Invoice savedInvoice = invoiceRepository.save(existingInvoice);
            return savedInvoice;
        }

        return null;
    }

    @Override
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
    
    @Override
    public String generateInvoiceNumber() {
        int currentYear = LocalDate.now().getYear() % 100;
        Integer lastInvoiceNumber = invoiceRepository.findLastInvoiceNumberByYear(String.format("%02d", currentYear));

        if (lastInvoiceNumber == null) {
            lastInvoiceNumber = 0;
        }

        int newInvoiceNumber = lastInvoiceNumber + 1;

        String formattedInvoiceNumber = String.format("%02d%06d", currentYear, newInvoiceNumber);

        return formattedInvoiceNumber;
    }
}

