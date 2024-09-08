import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { CommonModule } from '@angular/common';
import { GetAllProducts } from '../shared/models/Product/GetAllProducts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: GetAllProducts[] = [];
  load = false;

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productService.searchResults$.subscribe((results) => {
      this.searchResults = results;
    });  }

  search() {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe((results) => {
        this.load=false
        this.productService.updateSearchResults(results);
      });
    }
  }
}
