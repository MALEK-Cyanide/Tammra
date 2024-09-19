import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from './cart.service';
import { AccountService } from '../../account/account.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { CartDto } from './CartDto';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  totalAmount = 0.0;
  cartItems: CartDto[] = [];
  url = environment.appUrl;
  qun :any
  checkCart = false

  @Input() value: number = 1; // Default value

  constructor(private cartService: CartService, private account: AccountService) { }
  ngOnInit(): void {
    this.cartService.getCart(this.account.getJWT().email).subscribe((data) => {
      this.cartItems = data;
      this.qun = this.cartItems.length
      this.totalAmount = this.cartItems.reduce((total, item) => {
        const itemPrice = item.priceAfterSale !== 0 ? item.priceAfterSale : item.price;
        return total + itemPrice * item.quantity;
      }, 0);
    });
  }

  checkQuntity(){
    if(this.qun == 0){
      this.checkCart = false
    }
    else{
      this.checkCart = true
    }
  }

  removeItem(item: any) {
    this.cartService.deleteItem(item).subscribe((res) => {
      window.location.reload()
    })
  }
  increment(item: any): void {
    if (item.quantity < item.totalQuantity) {
      item.quantity++;
      this.changeQ(item.cartItemId, item.quantity)
    }
  }

  decrement(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.changeQ(item.cartItemId, item.quantity)
    }
  }
  changeQ(id: number, quntity: number) {
    this.cartService.changQ(id, quntity).subscribe((res) => {
      this.totalAmount = this.cartItems.reduce((total, item) => {
        const itemPrice = item.priceAfterSale !== 0 ? item.priceAfterSale : item.price;
        return total + itemPrice * item.quantity;
      }, 0);
    })
  }
}
