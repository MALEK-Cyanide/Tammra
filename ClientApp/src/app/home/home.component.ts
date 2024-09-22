import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { GetAllProducts } from '../shared/models/Product/GetAllProducts';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../product/product.service';
import { AccountService } from '../account/account.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  url = environment.appUrl
  AvgRate: number | undefined
  stars: number[] = [0, 1, 2, 3, 4, 5];

  constructor(private http: HttpClient, private productService: ProductService, private accountService: AccountService
    , private route: ActivatedRoute
  ) { }

  product_card = {

    productName: 'Product 1',
    price: 100,
    quantity: '10 كيلو',
    priceAfterSale: 50,
    imagePath: '/Images/coverphoto.jpg',
    sale: '  10%',
    discount: '20%',
  }

  isHovered = false;
  currentPage = 0;
  productsPerPage = 6;
  products: GetAllProducts[] = []
  product?: GetAllProducts

  ngOnInit() {
    this.setProductsPerPage();
    this.getProduct();
    this.getRate();
    this.getAllProd()
  }
  getAllProd() {
    this.productService.getAllProductsForHome().subscribe
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
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setProductsPerPage();
  }

  setProductsPerPage() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      this.productsPerPage = 4;
    } else if (screenWidth >= 768 && screenWidth < 992) {
      this.productsPerPage = 4;
    } else {
      this.productsPerPage = 4;
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

  // Navigate to the previous page
  prev() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  // Navigate to the next page
  next() {
    if (this.currentPage + 1 < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}
