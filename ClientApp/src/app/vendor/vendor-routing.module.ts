import { RouterModule, Routes } from "@angular/router";
import { AllProductComponent } from "../product/all-product/all-product.component";
import { AddProductComponent } from "../product/add-product/add-product.component";
import { EditProductComponent } from "../product/edit-product/edit-product.component";
import { ShowProductComponent } from "../product/show-product/show-product.component";
import { DeleteProductComponent } from "../product/delete-product/delete-product.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { VendorSettingsComponent } from "./vendor-settings/vendor-settings.component";
import { VendorInfoComponent } from "./vendor-info/vendor-info.component";

const routes: Routes = [
  { path: 'all-product', component: AllProductComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'show-product/:id', component: ShowProductComponent },
  { path: 'delete-product/:id', component: DeleteProductComponent },
  { path: 'vendor-settings', component: VendorSettingsComponent },
  { path: 'vendor-info', component: VendorInfoComponent }

]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class VendorRoutingModule { }