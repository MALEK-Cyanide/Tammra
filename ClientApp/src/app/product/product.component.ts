import { Component } from '@angular/core';
import { AllProductComponent } from "./all-product/all-product.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [AllProductComponent, AddProductComponent, RouterModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}