import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { GetAllProducts } from '../shared/models/Product/GetAllProducts';
import { environment } from '../../environments/environment.development';
import { ProductService } from '../product/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../account/account.service';
import { VendorInfo } from '../vendor/VendorInfo';
import { VendorService } from '../vendor/vendor.service';
import Swal from 'sweetalert2';
import { CartService } from '../payment/cart/cart.service';

@Component({
  selector: 'app-productdet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productdet.component.html',
  styleUrl: './productdet.component.css'
})
export class ProductdetComponent implements OnInit {
  product: GetAllProducts | undefined;
  products: GetAllProducts[] = [];
  AvgRate: number | undefined
  stars: number[] = [1, 2, 3, 4, 5];
  url = environment.appUrl
  isHovered = false;
  currentPage = 0;
  productsPerPage = 6;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute, private http: HttpClient, private accountService: AccountService,
    private vendorService: VendorService, private router: Router, private cart: CartService
  ) { }

  ngOnInit(): void {
    this.getProduct();
    this.getRate();
    this.getAllProd()
  }
  getAllProd() {
    this.productService.getAllProductsForAdmin(this.accountService.getJWT().email).subscribe
      ((data: GetAllProducts[]) => {
        this.products = data;
      });
  }
  getProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe((product) => (this.product = product));
  }
  getRate() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getRate(id).subscribe((rate) => {
      this.AvgRate = rate
    })
  }

  reviews = [
    {
      author: 'علي محمد',
      rating: 5,
      date: '7 سبتمبر 2024',
      body: 'تحفة جدًا...طعم التمر عندهم مميز أوى'
    },
    {
      author: 'سلمى عمر',
      rating: 5,
      date: '17 أغسطس 2024',
      body: 'ممتازة جدا مقابل سعر جيد...'
    }
  ];
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setProductsPerPage();
  }
  setProductsPerPage() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      this.productsPerPage = 2; // For mobile screens
    } else if (screenWidth >= 768 && screenWidth < 992) {
      this.productsPerPage = 4; // For tablet screens
    } else {
      this.productsPerPage = 6; // For larger screens
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.products.length / this.productsPerPage);
  }
  getDisplayedProducts() {
    const start = this.currentPage * this.productsPerPage;
    const end = start + this.productsPerPage;
    return this.products.slice(start, end);
  }

  prev() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  next() {
    if (this.currentPage + 1 < Math.ceil(this.products.length / this.productsPerPage)) {
      this.currentPage++;
    }
  }
  showProduct(id: number) {
    this.productService.getProduct(id).subscribe((product) => {
      this.product = product
      this.scrollToTop();
    });
    this.productService.getRate(id).subscribe((rate) => {
      this.AvgRate = rate
    })
  }
  scrollToTop() {
    window.scrollTo({
      top: 650,
      behavior: 'smooth'
    });
  }
  addToCart(productId: number): void {
    this.cart.addToCart(productId, this.accountService.getJWT().email, 1).subscribe(() => {
      Swal.fire("", "تم إضافة طلبك إلى عربة المشتريات", "success")
    });
  }
}
