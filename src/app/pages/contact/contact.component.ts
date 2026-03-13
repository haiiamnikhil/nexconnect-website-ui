import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService, ContactMessage } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private titleSvc: Title, private meta: Meta) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.titleSvc.setTitle('Contact — NexConnect');
    this.meta.addTags([
      { name: 'description', content: 'Get in touch with the NexConnect team for demos, pricing, and enterprise support.' },
      { property: 'og:title', content: 'Contact — NexConnect' },
      { property: 'og:description', content: 'Reach out to our team for enterprise software demos and support.' },
      { property: 'og:type', content: 'website' }
    ]);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loading = true;
      const contactData: ContactMessage = this.contactForm.value;

      this.apiService.submitContact(contactData).subscribe({
        next: () => {
          this.loading = false;
          this.submitted = true;
        },
        error: (err) => {
          console.error('Error submitting form', err);
          this.loading = false;
        }
      });
    }
  }

  resetForm() {
    this.submitted = false;
    this.contactForm.reset();
  }
}
