import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../customer/customer.service';
import { AccountService } from '../../account/account.service';
import { Customer } from '../../customer/Customer';
import { Payment } from './Payment';
import { HttpClient } from '@angular/common/http';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  visaForm: FormGroup = new FormGroup({});
  customer: Customer | undefined
  order: Payment | undefined
  isVisaSelected = false;
  submitted = false;
  checkbox1 = false;
  checkbox2 = true;
  checkbox3 = false;
  total = 0;
  totalafter = 0
  OrderNum = ""
  email: any
  payed = false

  stripe: Stripe | null = null;
  cardElement: any;

  constructor(private CustomerServices: CustomerService, private Account: AccountService, private http: HttpClient
    , private cartService: CartService
  ) {

  }

  async ngOnInit() {
    this.visaForm = new FormGroup({
      paymentMethod: new FormControl('', Validators.required),
      cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]),
      cardHolder: new FormControl('', Validators.required),
      expirationDate: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]),
      cvv: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]),
    });
    this.getCustomer()
    this.getOeder()

    this.stripe = await loadStripe('pk_test_51Q0Wv3P8yplZeUgfnmrLV64flsNisZL3DMzigsTtkqtCZ7i71iX27rFIRzM42kKbygdYtovCaKeBqwhrnyQreNfz00r0Z8N7xQ');

    const elements = this.stripe?.elements();
    this.cardElement = elements?.create('card', {
      style: {
        base: {
          color: '#32325d', // Text color
          fontFamily: '"Cairo", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '20px',
          '::placeholder': {
            color: '#aab7c4', // Placeholder text color
          },
        },
        invalid: {
          color: '#910002', // Error color
          iconColor: '#910002',
        },
      },
    });
    this.cardElement?.mount('#card-element');
  }

  onPaymentMethodChange(event: any) {
    if (event.target.value === 'visa') {
      this.isVisaSelected = true;
    } else {
      this.isVisaSelected = false;
    }
  }
  getTotolPrice() {
    this.http.get<number>(`${environment.appUrl}/api/Payment/get-cart-price/${this.Account.getJWT().email}`).subscribe((res: number) => {
      this.total = res
    })
  }
  onSubmit() {
    this.submitted = true;
    if (this.visaForm.valid) {
    } else {
      alert('يرجى ملء جميع الحقول بشكل صحيح.');
      console.log('Form is invalid');
      console.log('Form invalid', this.visaForm.value);
    }
  }
  getEmail() {
    this.email = this.Account.getJWT().email
  }
  showInvalidInputMessage: boolean = false;
  validateInput(event: KeyboardEvent) {
    const inputKey = event.key;
    if (inputKey && !/[0-9/]/.test(inputKey)) {
      event.preventDefault();
      this.showInvalidInputMessage = true;
    } else {
      this.showInvalidInputMessage = false;
    }
  }

  getCustomer() {
    this.CustomerServices.getCustomer(this.Account.getJWT().email).subscribe((user: Customer) => {
      this.customer = user;
      this.email = user.email
    })
  }

  getOeder() {
    this.CustomerServices.getOrder(this.Account.getJWT().email).subscribe((order: Payment) => {
      this.order = order
      this.total = order.totalAmount
      this.totalafter = order.totalAmount + 30
      this.OrderNum = order.orderNum
    })
  }

  onCheckboxChange(checkedBox: number) {
    if (checkedBox === 1) {
      this.checkbox2 = false;
    } else if (checkedBox === 2) {
      this.checkbox1 = false;
      window.location.reload()
    }
  }
  async handlePayment(event: Event) {
    event.preventDefault();

    try {
      const response = await fetch(`${environment.appUrl}/api/order/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: this.totalafter * 100,
          email: this.email
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Error from API:', data.error);
        alert('Payment failed. Please try again.');
        return;
      }

      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        throw new Error('Client secret is missing from the response.');
      }

      const result = await this.stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
        },
      });

      if (result?.error) {
        console.error('Error confirming payment:', result.error.message);
        alert('Payment failed. Please try again.');
      } else if (result?.paymentIntent?.status === 'succeeded') {
        Swal.fire("تمت عملية الدفع", `كود طلبك : ${this.OrderNum}`, "success")
        this.payed = true
      } else {
        alert('Payment failed. Please check your card details and try again.');
      }
    } catch (error) {
      console.error('Error during payment processing:', error);
      alert('Payment processing error. Please try again.');
    }
  }
  whenRecive() {
    const formdata = new FormData()
    formdata.append('email', this.Account.getJWT().email)
    this.http.post(`${environment.appUrl}/api/payment/whenRecive`, formdata).subscribe((res) => {
      Swal.fire("", "تم تأكيد طريقة الدفع سيتواصل معك المندوب قريبا", "success")
    })
  }
  downloadOrder(){
    this.cartService.downloadOrderPdf(this.Account.getJWT().email).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `بيانات طلبك.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    );
  }
  Coupon(){
    this.checkbox3 = true
  }
}