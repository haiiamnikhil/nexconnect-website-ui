import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  // --- Static Mock Data Arrays ---
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Neon Glasses',
      description: 'Futuristic glowing glasses perfect for cyberpunk parties.',
      price: 49.99,
      image_url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop',
      tag: 'Accessories',
      accent_color: '#ff00ff'
    },
    {
      id: 2,
      name: 'Cyber Jacket',
      description: 'High-tech LED embedded waterproof jacket.',
      price: 199.99,
      image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      tag: 'Apparel',
      accent_color: '#00ffff'
    },
    {
      id: 3,
      name: 'Holo Watch',
      description: 'Smartwatch with a holographic projected display.',
      price: 299.99,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      tag: 'Electronics',
      accent_color: '#00ffaa'
    }
  ];

  private mockContacts: ContactMessage[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      message: 'When will the Holo Watch be back in stock?',
      created_at: new Date().toISOString(),
      status: 'pending'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'I love your cyberpunk aesthetics!',
      created_at: new Date().toISOString(),
      status: 'resolved'
    }
  ];

  private mockAdminUsers: AdminUser[] = [
    { id: 1, username: 'mail@nex-connect.in' }
  ];

  constructor() {}

  // --- Public ---
  getProducts(): Observable<Product[]> {
    return of([...this.mockProducts]).pipe(delay(500));
  }

  submitContact(contact: ContactMessage): Observable<any> {
    const newContact = { ...contact, id: Date.now(), created_at: new Date().toISOString(), status: 'pending' };
    this.mockContacts.unshift(newContact);
    return of({ message: 'Contact submitted successfully' }).pipe(delay(500));
  }

  // --- Admin ---
  adminLogin(credentials: any): Observable<any> {
    // Static Login Validation
    if (credentials.email === 'mail@nex-connect.in' && credentials.password === 'admin') {
      return of({ access_token: 'static_mock_token_12345', token_type: 'bearer' }).pipe(delay(800));
    }
    return throwError(() => new Error('Invalid credentials')).pipe(delay(800));
  }

  getAdminUsers(): Observable<AdminUser[]> {
    return of([...this.mockAdminUsers]).pipe(delay(300));
  }

  getAdminProducts(): Observable<Product[]> {
    return of([...this.mockProducts]).pipe(delay(400));
  }

  createProduct(product: Product): Observable<Product> {
    const newProduct = { ...product, id: Date.now() };
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(delay(600));
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts[index] = { ...this.mockProducts[index], ...product };
      return of(this.mockProducts[index]).pipe(delay(600));
    }
    return throwError(() => new Error('Product not found')).pipe(delay(600));
  }

  deleteProduct(id: number): Observable<any> {
    this.mockProducts = this.mockProducts.filter(p => p.id !== id);
    return of({ message: 'Deleted successfully' }).pipe(delay(600));
  }

  getContacts(): Observable<ContactMessage[]> {
    return of([...this.mockContacts]).pipe(delay(400));
  }
}
