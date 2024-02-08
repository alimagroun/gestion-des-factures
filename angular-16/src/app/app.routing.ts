import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceCreateComponent } from './invoice-create/invoice-create.component';
import { QuoteCreateComponent } from './quote-create/quote-create.component';
import { QuoteListComponent } from './quote-list/quote-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

import { AuthGuard } from './guards/auth.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'invoice-create',
        component: InvoiceCreateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invoice/:id',
        component: InvoiceCreateComponent,
        canActivate: [AuthGuard]
      },    
      {
        path: 'quote-create',
        component: QuoteCreateComponent,
        canActivate: [AuthGuard]
      },      
      { 
        path: 'invoice-list',
        component: InvoiceListComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'quote-list',
        component: QuoteListComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'product-list',
        component: ProductListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'customer-list',
        component: CustomerListComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

];
