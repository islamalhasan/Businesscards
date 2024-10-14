import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessCardService } from '../Service/business-card.service';
import { BusinessCard } from '../Models/BusinessCard';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';



@Component({
  selector: 'app-edit-business-card',
  standalone: true,
  imports: [  ReactiveFormsModule,  // Import required modules directly here
    MatDialogModule],
  templateUrl: './edit-business-card.component.html',
  styleUrl: './edit-business-card.component.css'
})
export class EditBusinessCardComponent {


  businessCardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private businessCardService: BusinessCardService,
    private dialogRef: MatDialogRef<EditBusinessCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BusinessCard
  ) {
    this.businessCardForm = this.fb.group({
      name: [data.name, Validators.required],
      gender: [data.gender, Validators.required],
      dateOfBirth: [data.dateOfBirth],
      email: [data.email, [Validators.required, Validators.email]],
      phone: [data.phone, Validators.required],
      address: [data.address],
      notes: [data.notes],
      photo: [data.photo]
    });
  }

  onSave() {
    if (this.businessCardForm.valid) {
      const updatedCard: BusinessCard = {
        id: this.data.id,
        ...this.businessCardForm.value
      };

      // Call the service method to update the business card
      this.businessCardService.updateBusinessCard(updatedCard.id, updatedCard).subscribe(
        response => {
          this.dialogRef.close(updatedCard); // Close the dialog and pass the updated card
        },
        error => {
          console.error('Error updating business card:', error);
          alert('Failed to update business card: ' + error.message);
        }
      );
    }
  }





  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.businessCardForm.patchValue({
          photo: (e.target?.result as string).split(',')[1] // Get Base64 string without header
        });
      };

      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog without saving changes
  }

}
