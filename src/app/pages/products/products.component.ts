import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService, Product } from '../../services/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  skeletonItems = Array(6).fill(0); // 6 skeleton cards

  constructor(private apiService: ApiService, private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('Products — NexConnect Enterprise Software Suite');
    this.meta.addTags([
      { name: 'description', content: 'Explore the NexConnect product suite: NexHR, NexCRM, NexERP, NexOffice, and Trendzo — all built for enterprise scale.' },
      { property: 'og:title', content: 'Products — NexConnect' },
      { property: 'og:description', content: 'Unified enterprise software solutions from NexConnect.' },
      { property: 'og:type', content: 'website' }
    ]);
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
  }
}
