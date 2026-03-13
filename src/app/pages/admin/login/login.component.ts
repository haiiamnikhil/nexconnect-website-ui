import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private router: Router, private title: Title, private api: ApiService) {}

  ngOnInit() {
    this.title.setTitle('Admin Sign In — NexConnect');
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.api.adminLogin({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('admin_token', res.access_token);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: any) => {
        this.error = 'Invalid credentials. Access denied.';
        this.loading = false;
      }
    });
  }
}
