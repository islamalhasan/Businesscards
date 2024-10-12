import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BusinessCardService } from '../Service/business-card.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-card-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-card-form.component.html',
  styleUrl: './business-card-form.component.css'
})
export class BusinessCardFormComponent {
  deleteBusinessCard(arg0: any) {
    throw new Error('Method not implemented.');
  }
  selectCard(_t5: any) {
    throw new Error('Method not implemented.');
  }
  businessCards: any[] = []; // Initialize as an empty array

  constructor( public BusinessCardHome: BusinessCardService) { }

  ngOnInit(): void {
    this.loadBusinessCards(); // Load business cards when the component initializes
  }

  loadBusinessCards(): void {
    this.BusinessCardHome.getAll().subscribe(
      cards => {
        this.businessCards = cards; // Set the business cards
      },
      error => {
        console.error('Failed to load business cards:', error); // Log the error
      }
    );
  }
}
