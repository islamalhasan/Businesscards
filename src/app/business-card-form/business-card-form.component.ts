import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BusinessCardService } from '../Service/business-card.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessCard } from '../Models/BusinessCard';
import { Observable } from 'rxjs';
import saveAs from 'file-saver';
import * as Papa from 'papaparse'; // Correct way to import PapaParse



@Component({
  selector: 'app-business-card-form',
  standalone: true,
  imports: [CommonModule,FormsModule],
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
  filteredCards: BusinessCard[] = [];
  previewData: any[] = [];  // To store parsed CSV data for preview
  isDragOver: boolean = false; // To track drag state


  

  filterText: string = '';
  filterdateOfBirth: Date | null = null; // Add filters for other fields if needed
  filterPhone: string = '';
  filterGender: string = '';
  filterEmail: string = '';

  newCard: BusinessCard = {
    id: 0,
    name: '',
    gender: '',
    dateOfBirth:null,
    email: '',
    address: '',
    phone: '',
    photo:'',
    notes:'',
    UserId: 1
  };
  selectedFile: File | null = null;
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

    // Method to handle form submission
    createBusinessCard(): void {
      this.BusinessCardHome.createBusinessCard(this.newCard).subscribe(
        (createdCard) => {
          console.log('Business card created successfully:', createdCard);
          this.businessCards.push(createdCard); // Add the new card to the list
          this.newCard = { id: 0, name: '', phone: '', gender: '', email: '', address: '' , dateOfBirth :null
            ,photo:'',notes:'',UserId :1}; // Reset the form
        },
        (error) => {
          console.error('Failed to create business card:', error);
        }
      );
    }

     applyFilters() {
    this.filteredCards = this.businessCards.filter(card => {
      return (
        (!this.filterText || card.name.toLowerCase().includes(this.filterText.toLowerCase())) &&
        (!this.filterdateOfBirth || new Date(card.dateOfBirth).toDateString() === new Date(this.filterdateOfBirth).toDateString()) &&
        (!this.filterPhone || card.phone.includes(this.filterPhone)) &&
        (!this.filterGender || card.gender === this.filterGender) &&
        (!this.filterEmail || card.email.toLowerCase().includes(this.filterEmail.toLowerCase()))
      );
    });
  }

  clearFilters() {
    // Reset all filter fields
    this.filterText = '';
    this.filterdateOfBirth = null;
    this.filterPhone = '';
    this.filterGender = '';
    this.filterEmail = '';
    
    // Reset filtered cards to all business cards
    this.filteredCards = [...this.businessCards];
  }


  exportCsv() {
    this.BusinessCardHome.exportToCsv().subscribe(blob => {
      // Create a URL for the Blob and trigger the download
      const url = window.URL.createObjectURL(blob);
      saveAs(blob, 'businesscards.csv'); // Using file-saver to download
    }, error => {
      console.error('Error exporting CSV:', error);
    });
  }

// Export to XML
exportXml() {
  this.BusinessCardHome.exportToXml().subscribe(blob => {
    // Trigger download of the XML file
    saveAs(blob, 'businesscards.xml'); // Using file-saver to save the XML file
  }, error => {
    console.error('Error exporting XML:', error);
  });
}


  // Handle file selection
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Prevent default to allow drop
    this.isDragOver = true; // Highlight the drop zone
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault(); // Prevent default
    this.isDragOver = false; // Remove highlight
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0]; // Get the dropped file

    // Check if the file is defined
    if (file instanceof File) {
        this.selectedFile = file;
        this.parseCsvFile(file); // Parse the CSV for preview
    } else {
        alert('No valid file was dropped.');
    }
  }

  parseCsvFile(file: File) {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        this.previewData = result.data; // Store parsed data for preview
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  }

  // Upload the CSV file
  uploadCsv() {
    if (this.selectedFile) {
      this.BusinessCardHome.importCsv(this.selectedFile).subscribe(response => {
        console.log('CSV file uploaded successfully:', response);
        alert('CSV file imported successfully');
        this.loadBusinessCards(); // Reload the grid after CSV import
        this.onFileSelected

      

      }, error => {
        console.error('Error uploading CSV file:', error);
        alert('Failed to import CSV file');
      });
    } else {
      alert('Please select a CSV file.');
    }
  }


  clearPreviewData() {
    this.previewData = [];
    this.selectedFile = null;
  }
  getCsvHeaders(): string[] {
    return this.previewData.length > 0 ? Object.keys(this.previewData[0]) : [];
  }


  
}
