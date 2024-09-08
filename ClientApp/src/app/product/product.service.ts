import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetAllProducts } from '../shared/models/Product/GetAllProducts';
import { AddProduct } from '../shared/models/Product/AddProduct';
import { EditProduct } from '../shared/models/Product/EditProduct';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private searchResultsSource = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResultsSource.asObservable();
  
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  getAllProducts(email: string): Observable<GetAllProducts[]> {
    const headers = new HttpHeaders({
      'Email': email // Custom header
    });
    return this.http.get<GetAllProducts[]>(`${environment.appUrl}/api/product/all-product`, { params: { email } });
  }
  addProduct(product: AddProduct): Observable<AddProduct> {
    return this.http.post<AddProduct>(`${environment.appUrl}/api/product/add-product`, product);
  }
  getProduct(id: number): Observable<GetAllProducts> {
    return this.http.get<GetAllProducts>(`${environment.appUrl}/api/product/get-product/${id}`);
  }
  updateProduct(product: EditProduct): Observable<EditProduct> {
    return this.http.put<EditProduct>(`${environment.appUrl}/api/product/edit-product/${product.productId}`, product);
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${environment.appUrl}/api/product/delete-product/${id}`);
  }
  searchProducts(query: string): Observable<any[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any[]>(`${environment.appUrl}/api/product/search-product`, { params });
  }
  updateSearchResults(results: any[]) {
    this.searchResultsSource.next(results);
  }
  // getImage(id: number) {
  //   console.log(id)

  //   return this.http.get(`${environment.appUrl}/api/product/getImage/${id}`, { responseType: 'blob' });
  // }

}
