### Gestion des factures

### Overview
This application provides a comprehensive solution for managing invoices, quotes, products, customers, and app settings. It allows users to perform CRUD operations on products and customers, generate and manage invoices and quotes, and export customer lists to Excel. Additionally, users can download invoices and quotes in PDF format.

### Technologies Used
#### Backend:
- Java 17
- MySQL

#### Frontend:
- Angular 16

### Features
- **Authentication:** Users can securely log in to the application.
  
- **Product Management:**
  - Create, read, update, and delete products.
  
- **Customer Management:**
  - Create, read, update, and delete customers.
  - Export customer lists to Excel format.
  
- **Invoice Management:**
  - Create, update, and delete invoices.
  - Download invoices in PDF format.
  
- **Quote Management:**
  - Create, update, and delete quotes.
  - Download quotes in PDF format.
  
- **Settings Management:**
  - manage application settings.

### Getting Started
#### Prerequisites
- Java 17
- Angular 16
- MySQL

#### Installation
1. Clone the repository.
2. Set up the backend:
   - Navigate to the backend directory.
   - Configure `application.properties` with your MySQL credentials.
   - Run `mvn spring-boot:run` to start the backend server.
3. Set up the frontend:
   - Navigate to the frontend directory.
   - Run `npm install` to install dependencies.
   - Run `npm start` to start the Angular development server.

#### Usage
- Access the application at `http://localhost:4200`.
- Log in with your credentials.
- Use the navigation to manage products, customers, invoices, quotes, and settings.
