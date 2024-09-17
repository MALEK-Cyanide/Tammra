import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from './cart.service';
import { AccountService } from '../../account/account.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { CartDto } from './CartDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartDto [] = [];
  url = environment.appUrl;

  constructor(private cartService: CartService, private account: AccountService) { }
  ngOnInit(): void {
    this.cartService.getCart(this.account.getJWT().email).subscribe((data) => {
      this.cartItems = data;
    });
  }
  
  checkout() {
    this.cartService.checkout(this.account.getJWT().email).subscribe((data) =>{
      Swal.fire("" , " " , "error")
    })
  }
}
