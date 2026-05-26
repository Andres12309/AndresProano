import { Routes } from '@angular/router';
import { ProductFormPageComponent } from '../presentation/pages/product-form-page/product-form-page.component';
import { ProductListPageComponent } from '../presentation/pages/product-list-page/product-list-page.component';

export const routes: Routes = [
  { path: '', component: ProductListPageComponent },
  { path: 'products/new', component: ProductFormPageComponent },
  { path: 'products/:id/edit', component: ProductFormPageComponent },
  { path: '**', redirectTo: '' },
];
