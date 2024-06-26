
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { LoginComponent } from './login/login.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceCreateComponent } from './invoice-create/invoice-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateModalComponent } from './product-create-modal/product-create-modal.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ProductEditModalComponent } from './product-edit-modal/product-edit-modal.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerCreateModalComponent } from './customer-create-modal/customer-create-modal.component';
import { CustomerEditModalComponent } from './customer-edit-modal/customer-edit-modal.component';
import { QuoteCreateComponent } from './quote-create/quote-create.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OptionsScrollDirective } from './directives/options-scroll.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuoteListComponent } from './quote-list/quote-list.component';
import { httpInterceptorProviders } from './helpers/http.interceptor';
import { AccountManagementComponent } from './account-management/account-management.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    LoginComponent,
    InvoiceListComponent,
    InvoiceCreateComponent,
    ProductListComponent,
    ProductCreateModalComponent,
    ProductEditModalComponent,
    DeleteConfirmationDialogComponent,
    CustomerListComponent,
    CustomerCreateModalComponent,
    CustomerEditModalComponent,
    OptionsScrollDirective,
    QuoteCreateComponent,
    QuoteListComponent,
    AccountManagementComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    AppSidebarComponent,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSortModule,
    MatProgressBarModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
