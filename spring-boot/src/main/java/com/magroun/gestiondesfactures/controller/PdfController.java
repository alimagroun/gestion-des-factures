package com.magroun.gestiondesfactures.controller;

import org.springframework.web.bind.annotation.RestController;

import com.magroun.gestiondesfactures.model.Invoice;
import com.magroun.gestiondesfactures.service.InvoiceServiceImpl;
import com.magroun.gestiondesfactures.util.PdfUtils;

import java.util.Base64;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {
	
    private final InvoiceServiceImpl invoiceService;

    public PdfController(InvoiceServiceImpl invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping(value = "/generate-invoice/{invoiceId}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateInvoicePdf(@PathVariable Long invoiceId) {
        Invoice invoice = invoiceService.getInvoiceById(invoiceId);
        if (invoice == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        byte[] pdfBytes = PdfUtils.generatePdfFromInvoice(invoice);

        String filename = "invoice_" + invoiceId + ".pdf";
        String encodedFilename = Base64.getEncoder().encodeToString(filename.getBytes());

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + encodedFilename)
                .body(pdfBytes);
    }
}
