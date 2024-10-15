import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BusinessCardService } from '../Service/business-card.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessCard } from '../Models/BusinessCard';
import { Observable } from 'rxjs';
import saveAs from 'file-saver';
import * as Papa from 'papaparse'; // Correct way to import PapaParse
import { parseString } from 'xml2js';
import { EditBusinessCardComponent } from '../edit-business-card/edit-business-card.component';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Toastr
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';







@Component({
  selector: 'app-business-card-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
   ],
  templateUrl: './business-card-form.component.html',
  styleUrl: './business-card-form.component.css'
  
})
export class BusinessCardFormComponent {

  businessCards: any[] = []; // Initialize as an empty array
  filteredCards: BusinessCard[] = [];
  previewData: any[] = [];  // To store parsed CSV data for preview
  isDragOver: boolean = false; // To track drag state
  selectedFileType: string = 'csv'; // Default to CSV
  selectedFile: File | null = null;



  

  filterText: string = '';
  filterdateOfBirth: Date | null = null; // Add filters for other fields if needed
  filterPhone: string = '';
  filterGender: string = '';
  filterEmail: string = '';

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


  
  constructor( public BusinessCardHome: BusinessCardService,private dialog: MatDialog,private router: Router) { }

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


  // Define the file type for the dropdown



// Handle drag and drop events
onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    this.selectedFile = file;
    this.processFile(file);
  } else {
    alert('No valid file was dropped.');
  }
}

// Handle file selection
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    this.selectedFile = file;
    this.processFile(file);
  }
}

// Process the selected file based on its type
processFile(file: File) {
  if (this.selectedFileType === 'csv') {
    this.parseCsvFile(file);
  } else if (this.selectedFileType === 'xml') {
    this.parseXmlFile(file);
  }
}

// Parse CSV file
parseCsvFile(file: File) {
  Papa.parse(file, {
    header: true,
    complete: (result) => {
      this.previewData = result.data;
    },
    error: (error) => console.error('Error parsing CSV:', error)
  });
}

// Parse XML file
parseXmlFile(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    const xmlString = reader.result as string;
    parseString(xmlString, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
      } else {
        this.previewData = result; // Store parsed data for preview
      }
    });
  };
  reader.readAsText(file);
  
}

// Upload the selected file
uploadFile() {
  console.log('Selected File Type:', this.selectedFileType); 
  console.log('Selected File:', this.selectedFile);
  if (this.selectedFile) {
    if (this.selectedFileType === 'csv') {
      console.log('Uploading CSV file...');
      this.uploadCsv();
    } else if (this.selectedFileType === 'xml') {
      console.log('Uploading XML file...');
      this.uploadXml();
    }
  } else {
    alert('Please select a file.');
  }
}

// Upload CSV to backend
uploadCsv() {
  this.BusinessCardHome.importCsv(this.selectedFile!).subscribe(response => {
    console.log('CSV file uploaded successfully:', response);
    alert('CSV file imported successfully');
    this.loadBusinessCards(); // Reload the grid after CSV import
  }, error => {
    console.error('Error uploading CSV file:', error);
    alert('Failed to import CSV file');
  });
}

// Upload XML
uploadXml() {
  console.log('Starting XML upload...'); 
  this.BusinessCardHome.importXml(this.selectedFile!).subscribe(
    response => {
      console.log('XML file uploaded successfully:', response);
      alert('XML file imported successfully');
      this.loadBusinessCards(); // Reload the grid after XML import
    },
    error => {
      console.error('Error uploading XML file:', error);
      alert('Failed to import XML file');
    }
  );
}

getHeaders(): string[] {
  return this.previewData.length > 0 ? Object.keys(this.previewData[0]) : [];
}


openUpdateDialog(card: BusinessCard) {
  const dialogRef = this.dialog.open(EditBusinessCardComponent, {
   

    data: card,
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
        const index = this.businessCards.findIndex(c => c.id === result.id);
        if (index !== -1) {
            this.businessCards[index] = result; // Update the card in the list with the updated data
        }
       
    }
  });

}


 // Method to show confirmation dialog
 confirmDelete(cardId: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: { id: cardId }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.deleteBusinessCard(cardId);
    }
  });
}

// Method to delete business card
deleteBusinessCard(id: number) {
  this.BusinessCardHome.deleteBusinessCard(id).subscribe(
    response => {
      this.businessCards = this.businessCards.filter(card => card.id !== id);
      // Optionally show a success message
    },
    error => {
      // Handle error (e.g., show an error message)
    }
  );
}

openCreatePage() {
  this.router.navigate(['/create-business-card']);
}
  
}
