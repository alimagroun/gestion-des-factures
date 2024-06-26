package com.magroun.gestiondesfactures.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.magroun.gestiondesfactures.model.Invoice;
import com.magroun.gestiondesfactures.model.LineItem;
import com.magroun.gestiondesfactures.model.Address;
import com.itextpdf.text.pdf.PdfPCell;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class PdfUtils {

    public static byte[] generatePdfFromInvoice(Invoice invoice) {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            addInvoiceDetails(document, invoice);
            document.add(new Paragraph(" "));
            addLineItemsTable(document, invoice.getLineItems(), invoice.getStamp());

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return outputStream.toByteArray();
    }

    private static void addInvoiceDetails(Document document, Invoice invoice) throws DocumentException {
    	
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 3, 1 });
        table.getDefaultCell().setBorder(PdfPCell.NO_BORDER);

        PdfPCell customerCell = new PdfPCell();
        customerCell.setBorder(PdfPCell.NO_BORDER);

        String firstName = invoice.getCustomer().getFirstName();
        String lastName = invoice.getCustomer().getLastName();
        String companyName = invoice.getCustomer().getCompanyName();
        String taxIdentificationNumber = invoice.getCustomer().getTaxIdentificationNumber();
        Address address = invoice.getCustomer().getAddress();

        StringBuilder customerInfo = new StringBuilder("Nom : ");
        if (firstName != null && !firstName.isEmpty() && lastName != null && !lastName.isEmpty()) {
            customerInfo.append(firstName).append(" ").append(lastName);
        }
        customerInfo.append("\n");

        customerInfo.append("Nom Société : ");
        if (companyName != null && !companyName.isEmpty()) {
            customerInfo.append(companyName);
        }
        customerInfo.append("\n");

        customerInfo.append("Mat. Fiscale : ");
        if (taxIdentificationNumber != null && !taxIdentificationNumber.isEmpty()) {
            customerInfo.append(taxIdentificationNumber);
        }
        customerInfo.append("\n");

        customerInfo.append("Adresse : ");
        if (address != null) {
            String streetAddress = address.getStreetAddress();
            String city = address.getCity();
            String state = address.getState();

            if (streetAddress != null && !streetAddress.isEmpty()) {
                customerInfo.append(streetAddress).append(" ");
            }

            if (city != null && !city.isEmpty()) {
                customerInfo.append(city).append(" ");
            }

            if (state != null && !state.isEmpty()) {
                customerInfo.append(state);
            }
        }

        String finalCustomerInfo = customerInfo.toString();

        customerCell.addElement(new Phrase(finalCustomerInfo));

        PdfPCell invoiceIdCell = new PdfPCell();
        invoiceIdCell.setBorder(PdfPCell.NO_BORDER);
        String label = invoice.isQuote() ? "N° de devis : " : "N° de facture : ";
        Chunk invoiceIdChunk = new Chunk(label + invoice.getInvoiceNumber());
        Phrase invoiceIdPhrase = new Phrase(invoiceIdChunk);
        invoiceIdCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        invoiceIdCell.addElement(invoiceIdPhrase);

        table.addCell(customerCell);
        table.addCell(invoiceIdCell);

        document.add(table);
    }

    private static void addLineItemsTable(Document document, List<LineItem> lineItems, double stamp) throws DocumentException {
        PdfPTable table = new PdfPTable(11);
        table.setWidthPercentage(100);
        table.setHorizontalAlignment(Element.ALIGN_LEFT);
        Font smallFont = new Font(Font.FontFamily.HELVETICA, 9);

        table.addCell(new Phrase("Reference", smallFont));
        table.addCell(new Phrase("Designation", smallFont));
        table.addCell(new Phrase("Quantity", smallFont));
        table.addCell(new Phrase("Unit Price HT", smallFont));
        table.addCell(new Phrase("Total Price HT", smallFont));
        table.addCell(new Phrase("Discount (%)", smallFont));
        table.addCell(new Phrase("Discount Amount", smallFont));
        table.addCell(new Phrase("Total Price After Discount HT", smallFont));
        table.addCell(new Phrase("Tax (%)", smallFont));
        table.addCell(new Phrase("Tax Amount", smallFont));
        table.addCell(new Phrase("Total Price After Discount TTC", smallFont));
        
        double totalHT = 0.0;
        double totalDiscount =0.0;
        double totalHTAfterDiscount =0.0;
        double totalTax =0.0;
        double totalTTC =0.0;
        double totalTopay =0.0;
        
        for (LineItem lineItem : lineItems) {
            table.addCell(new Phrase(lineItem.getProduct().getReference(), smallFont));
            table.addCell(new Phrase(lineItem.getProduct().getDesignation(), smallFont));
            table.addCell(new Phrase(String.valueOf(lineItem.getQuantity()), smallFont));
            double unitPrice = lineItem.getUnitPrice();
            String formattedUnitPrice = String.format("%.3f", unitPrice);
            table.addCell(new Phrase(formattedUnitPrice, smallFont));
            table.addCell(new Phrase(String.valueOf(lineItem.getSubtotal()), smallFont));
            table.addCell(new Phrase(String.valueOf(lineItem.getDiscountPercentage()), smallFont));
            double discountAmount = lineItem.getSubtotal() * (lineItem.getDiscountPercentage() / 100.0);
            String formattedDiscountAmount = String.format("%.3f", discountAmount);
            table.addCell(new Phrase(formattedDiscountAmount, smallFont));
            double totalPriceAfterDiscountHT = lineItem.getSubtotal() - discountAmount;
            String formattedTotalPriceAfterDiscountHT = String.format("%.3f", totalPriceAfterDiscountHT);
            table.addCell(new Phrase(formattedTotalPriceAfterDiscountHT, smallFont));
            table.addCell(new Phrase(String.valueOf(lineItem.getTax()), smallFont));
            double taxAmount = (totalPriceAfterDiscountHT * lineItem.getTax()) / 100.0;
            String formattedTaxAmount = String.format("%.3f", taxAmount);
            table.addCell(new Phrase(formattedTaxAmount, smallFont));
            double totalPriceAfterDiscountTTC = totalPriceAfterDiscountHT + taxAmount;
            String formattedTotalPriceAfterDiscountTTC = String.format("%.3f", totalPriceAfterDiscountTTC);
            table.addCell(new Phrase(formattedTotalPriceAfterDiscountTTC, smallFont));
            
       
            totalHT += lineItem.getSubtotal();
            totalDiscount += discountAmount;
            totalHTAfterDiscount += totalPriceAfterDiscountHT;
            totalTax += taxAmount;
            totalTTC += totalPriceAfterDiscountTTC;
        }
        
        	totalTopay =totalTTC + stamp;
        
     PdfPCell emptyCell = new PdfPCell(new Phrase(""));
     emptyCell.setColspan(5);
     emptyCell.setBorder(Rectangle.NO_BORDER);

     PdfPCell nestedCell = new PdfPCell();
     nestedCell.setBorder(Rectangle.NO_BORDER);
     nestedCell.setColspan(6);

     PdfPTable nestedTable = new PdfPTable(2);
     nestedTable.setWidthPercentage(100);
     nestedTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
     
     nestedTable.addCell("Total HT");
     nestedTable.addCell(String.format("%.3f", totalHT));

     nestedTable.addCell("Total Remise HT");
     nestedTable.addCell(String.format("%.3f", totalDiscount));
     
     nestedTable.addCell("Total HT Après Remise");
     nestedTable.addCell(String.format("%.3f", totalHTAfterDiscount));
     
     nestedTable.addCell("TVA");
     nestedTable.addCell(String.format("%.3f", totalTax));
     
     nestedTable.addCell("Total TTC");
     nestedTable.addCell(String.format("%.3f", totalTTC));
     
     nestedTable.addCell("Timbre");
     nestedTable.addCell(String.format("%.3f", stamp));
     
     nestedTable.addCell("Total à Payer");
     nestedTable.addCell(String.format("%.3f", totalTopay));
     
     nestedCell.addElement(nestedTable);
   
     table.addCell(emptyCell);
     table.addCell(nestedCell);

     document.add(table);
    }
}