import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllProductComponent } from './all-product/all-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { ShowProductComponent } from './show-product/show-product.component';
import { VendorAccountComponent } from './vendor-account/vendor-account.component';

const routes: Routes = [
  {path: 'all-product' , component:AllProductComponent},
  {path: 'add-product' , component:AddProductComponent},
  {path: 'edit-product/:id' , component:EditProductComponent},
  {path: 'show-product/:id' , component:ShowProductComponent},
  {path: 'delete-product/:id' , component:DeleteProductComponent},
  {path: 'vendor-account' , component:VendorAccountComponent},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
