package com.magroun.gestiondesfactures.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.magroun.gestiondesfactures.model.Invoice;
import com.magroun.gestiondesfactures.model.LineItem;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class PdfUtils {

    public static byte[] generatePdfFromInvoice(Invoice invoice) {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            addInvoiceDetails(document, invoice);
            document.add(Chunk.NEWLINE);
            addLineItemsTable(document, invoice.getLineItems());

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return outputStream.toByteArray();
    }

    private static void addInvoiceDetails(Document document, Invoice invoice) throws DocumentException {
        Paragraph invoiceDetails = new Paragraph();
        invoiceDetails.add(new Paragraph("Invoice Details:"));

        Paragraph leftAligned = new Paragraph("Customer: " + invoice.getCustomer().getFirstName());
        invoiceDetails.add(leftAligned);

        Paragraph rightAligned = new Paragraph("Invoice ID: " + invoice.getInvoiceNumber());
        rightAligned.setAlignment(Element.ALIGN_RIGHT);
        invoiceDetails.add(rightAligned);

        document.add(invoiceDetails);
    }


    private static void addLineItemsTable(Document document, List<LineItem> lineItems) throws DocumentException {
        PdfPTable table = new PdfPTable(11);

        table.addCell("Reference");
        table.addCell("Designation");
        table.addCell("Quantity");
        table.addCell("Unit Price HT");
        table.addCell("Total Price HT");
        table.addCell("Discount (%)");
        table.addCell("Discount Amount");
        table.addCell("Total Price After Discount HT");
        table.addCell("Tax (%)");
        table.addCell("Tax Amount");
        table.addCell("Total Price After Discount TTC");

        for (LineItem lineItem : lineItems) {
        	table.addCell(lineItem.getProduct().getReference());
            table.addCell(lineItem.getProduct().getDesignation());
            table.addCell(String.valueOf(lineItem.getQuantity()));
            table.addCell(String.valueOf(lineItem.getUnitPrice()));
            table.addCell(String.valueOf(lineItem.getSubtotal()));
            table.addCell(String.valueOf(lineItem.getDiscountPercentage()));
            double discountAmount = lineItem.getSubtotal() * (lineItem.getDiscountPercentage() / 100.0);
            table.addCell(String.valueOf(discountAmount));
            double totalPriceAfterDiscountHT = lineItem.getSubtotal() - discountAmount;
            table.addCell(String.valueOf(totalPriceAfterDiscountHT));
            table.addCell(String.valueOf(lineItem.getTax()));
            double taxAmount = (totalPriceAfterDiscountHT * lineItem.getTax()) / 100.0;
            table.addCell(String.valueOf(taxAmount));
            double totalPriceAfterDiscountTTC = totalPriceAfterDiscountHT + taxAmount;
            table.addCell(String.valueOf(totalPriceAfterDiscountTTC));
        }

        document.add(table);
    }
}
