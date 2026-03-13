import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ApiService, Product, ContactMessage, AdminUser } from '../../../services/api.service';

export type AdminView = 'overview' | 'products' | 'users' | 'messages' | 'analytics';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  today = '';
  activeView: AdminView = 'overview';
  
  users: AdminUser[] = [];
  products: Product[] = [];
  contacts: ContactMessage[] = [];

  // Form states
  isEditing = false;
  currentProduct: Product = this.getEmptyProduct();

  constructor(private title: Title, private api: ApiService) {}

  ngOnInit() {
    this.title.setTitle('Dashboard — NexConnect Admin');
    this.today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.loadData();
  }

  loadData() {
    this.api.getAdminUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error loading users', err)
    });

    this.api.getAdminProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products', err)
    });
    
    this.api.getContacts().subscribe({
      next: (data) => this.contacts = data,
      error: (err) => console.error('Error loading contacts', err)
    });
  }

  setView(view: AdminView) {
    this.activeView = view;
  }

  // --- Product CRUD ---
  
  getEmptyProduct(): Product {
    return { name: '', description: '', price: 0, image_url: '', tag: '', accent_color: '' };
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.currentProduct = { ...product }; // clone so we don't edit the linked ref directly
    this.setView('products'); // ensure we're on the products tab
  }

  cancelEdit() {
    this.isEditing = false;
    this.currentProduct = this.getEmptyProduct();
  }

  saveProduct() {
    if (this.isEditing && this.currentProduct.id) {
      this.api.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: () => {
          this.loadData();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating product', err)
      });
    } else {
      this.api.createProduct(this.currentProduct).subscribe({
        next: () => {
          this.loadData();
          this.cancelEdit();
        },
        error: (err) => console.error('Error creating product', err)
      });
    }
  }

  deleteProduct(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      this.api.deleteProduct(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }
}
