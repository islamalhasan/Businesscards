import { Component } from '@angular/core';
import { BusinessCardService } from '../Service/business-card.service';
import { Router } from '@angular/router';
import { BusinessCard } from '../Models/BusinessCard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Papa from 'papaparse';
import { parseString } from 'xml2js';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule, MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';




@Component({
  selector: 'app-create-business-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,  
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatTableModule
     ],
  templateUrl: './create-business-card.component.html',
  styleUrl: './create-business-card.component.css'
})
export class CreateBusinessCardComponent {

  newCard: BusinessCard = {
    id: 0,
    name: '',
    gender: '',
    dateOfBirth:new Date(),
    email: '',
    address: '',
    phone: '',
    photo:'',
    notes:'',
    UserId: 1
  };

  businessCards: any[] = []; // Initialize as an empty array
  previewData: any[] = [];  // To store parsed CSV data for preview
  isDragOver: boolean = false; // To track drag state
  selectedFileType: string = 'csv'; // Default to CSV
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null; // To store image preview
  fileData: any[] = []; // Store the imported data for preview as table
  importedData: BusinessCard[] = []; // Store the preview of imported business cards



  constructor( public BusinessCardHome: BusinessCardService,private router: Router) { }

   // Handle the image file selection
   onFileSelectedImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.convertToBase64(file);
    }
  }

  // Convert the selected file to a Base64 string
  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      
      // Strip the prefix from the Base64 string
      const base64WithoutPrefix = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
      
      this.imagePreview = reader.result; // Preview the image (with the prefix)
      this.newCard.photo = base64WithoutPrefix; // Store the Base64 string without the prefix
    };
    reader.readAsDataURL(file);
  }

  createBusinessCard(): void {
    this.BusinessCardHome.createBusinessCard(this.newCard).subscribe(
      createdCard => {
        console.log('Business card created successfully:', createdCard);
        this.router.navigate(['/business-card-form']); 
     
        this.imagePreview = null;
      },
      error => {
        console.error('Failed to create business card:', error);
      }
    );
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



// Upload CSV to backend
uploadCsv() {
  this.BusinessCardHome.importCsv(this.selectedFile!).subscribe(response => {
    alert('CSV file imported successfully');
    this.loadBusinessCards();
  }, error => {
    alert('Failed to import CSV file');
  });
}

// Upload XML to backend
uploadXml() {
  this.BusinessCardHome.importXml(this.selectedFile!).subscribe(response => {
    alert('XML file imported successfully');
    this.loadBusinessCards();
  }, error => {
    alert('Failed to import XML file');
  });
}





getHeaders(): string[] {
  return this.previewData.length > 0 ? Object.keys(this.previewData[0]) : [];
}














}
