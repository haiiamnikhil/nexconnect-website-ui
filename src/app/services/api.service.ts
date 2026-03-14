import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  tag: string;
  accent_color: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
  status?: string;
}

export interface AdminUser {
  id: number;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private publicUrl = '/api/v1';
  private adminUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  // --- Public ---
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.publicUrl}/products`);
  }

  submitContact(contact: ContactMessage): Observable<any> {
    return this.http.post(`${this.publicUrl}/contact`, contact);
  }

  // --- Admin ---
  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  adminLogin(credentials: any): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', credentials.email); // OAuth2 expects username
    body.set('password', credentials.password);

    return this.http.post(`${this.adminUrl}/login`, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
  }

  getAdminUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(
      `${this.adminUrl}/users`,
      this.getAuthHeaders(),
    );
  }

  getAdminProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.adminUrl}/products`,
      this.getAuthHeaders(),
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(
      `${this.adminUrl}/products`,
      product,
      this.getAuthHeaders(),
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.adminUrl}/products/${id}`,
      product,
      this.getAuthHeaders(),
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(
      `${this.adminUrl}/products/${id}`,
      this.getAuthHeaders(),
    );
  }

  getContacts(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(
      `${this.adminUrl}/contacts`,
      this.getAuthHeaders(),
    );
  }
}
