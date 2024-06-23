import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'av_timer' },
  { state: 'invoice-create', type: 'link', name: 'Créer une facture', icon: 'crop_7_5' },
  { state: 'invoice-list', type: 'link', name: 'Factures', icon: 'view_comfy' },
  { state: 'product-list', type: 'link', name: 'Articles', icon: 'view_list' },
  { state: 'customer-list', type: 'link', name: 'Clients', icon: 'view_headline' },
  { state: 'quote-create', type: 'link', name: 'Créer un devis', icon: 'web' },
  { state: 'quote-list', type: 'link', name: 'Devis', icon: 'tab' },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
