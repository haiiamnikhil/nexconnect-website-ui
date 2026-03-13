import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ApiService, Product } from '../../services/api.service';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  products: Product[] = [];
  
  constructor(private api: ApiService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        if (isPlatformBrowser(this.platformId)) {
           // Small timeout to ensure *ngFor DOM is rendered before mapping GSAP
           setTimeout(() => this.initGsapAnimations(), 100);
        }
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  ngAfterViewInit() {
     // Plugins registered here
     if (isPlatformBrowser(this.platformId)) {
        gsap.registerPlugin(ScrollTrigger);
     }
  }

  private initGsapAnimations() {
     // 1. Hero Parallax / Pin
     ScrollTrigger.create({
         trigger: '.x-hero',
         start: 'top top',
         end: 'bottom bottom',
         pin: '.x-hero-sticky',
         scrub: true
     });

     gsap.to('.x-hero-canvas', {
         scale: 1.5,
         opacity: 0,
         scrollTrigger: {
             trigger: '.x-hero',
             start: 'top top',
             end: 'bottom top',
             scrub: true
         }
     });

     // 2. Narrative Text Scrub
     gsap.to('#narrative-text', {
         backgroundPosition: '0% 0',
         ease: 'none',
         scrollTrigger: {
             trigger: '.x-narrative',
             start: 'top center',
             end: 'bottom center',
             scrub: true
         }
     });

     // 3. Suite Cards Stacking Effect
     const cards = gsap.utils.toArray('.x-product-card');
     
     if (cards.length > 0) {
         ScrollTrigger.create({
             trigger: '.x-suite',
             start: 'top top',
             end: 'bottom bottom',
             pin: '.x-suite-sticky',
             scrub: true
         });

         // Calculate the stagger timeline
         const tl = gsap.timeline({
             scrollTrigger: {
                 trigger: '.x-suite',
                 start: 'top top',
                 end: 'bottom bottom',
                 scrub: 1
             }
         });

         cards.forEach((card: any, i: number) => {
             // Start them pushed down, bring them up one by one
             tl.to(card, {
                 y: (i * 40) + 'px',  // Slight offset per card
                 ease: 'power1.inOut'
             }, i * 0.5);
         });
     }

     // 4. Trendzo Mockup Float
     gsap.to('.x-phone-mockup', {
         y: -50,
         rotate: -5,
         scrollTrigger: {
             trigger: '.x-trendzo',
             start: 'top bottom',
             end: 'bottom top',
             scrub: true
         }
     });

     // Refresh scroll triggers if DOM shifted
     ScrollTrigger.refresh();
  }

  ngOnDestroy() {
     if (isPlatformBrowser(this.platformId)) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
     }
  }
}
