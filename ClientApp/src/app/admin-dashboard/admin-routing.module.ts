import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './all-products/add-product/add-product.component';
import { EditProductComponent } from './all-products/edit-product/edit-product.component';
import { DeleteProductComponent } from './all-products/delete-product/delete-product.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { ShowOrdersComponent } from './show-orders/show-orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { UsersAccountComponent } from './users-account/users-account.component';
import { CouponsComponent } from './coupons/coupons.component';
import { AddCouponComponent } from './coupons/add-coupon/add-coupon.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

const routes: Routes = [
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'delete-product/:id', component: DeleteProductComponent },
  { path: 'all-product', component: AllProductsComponent },
   { path: 'orders', component: ShowOrdersComponent },
  { path: 'order-details/:id', component: OrderDetailsComponent },
  { path: 'users', component: UsersAccountComponent },
  { path: 'copon', component: CouponsComponent },
  { path: 'add-copon', component: AddCouponComponent },
  { path: 'admin-settings', component: AdminSettingsComponent },
  

]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes),
    CommonModule
  ]
})
export class AdminRoutingModule { }
