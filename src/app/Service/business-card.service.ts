import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessCard } from '../Models/BusinessCard'; 




@Injectable({
  providedIn: 'root'
  
})
export class BusinessCardService {
  private apiUrl = 'https://localhost:7245/api/Businesscards'; // Adjust according to your API

  constructor(private http: HttpClient) { }

  // Ensure this method returns an Observable
  getAll(): Observable<BusinessCard[]> {
    return this.http.get<BusinessCard[]>(this.apiUrl);
  }


  // POST method to create a new business card
  createBusinessCard(cardData: BusinessCard): Observable<BusinessCard> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<BusinessCard>(this.apiUrl, cardData, { headers });
  }

    filterBusinessCards(
      name?: string,
      dateOfBirth?: Date | null,  // Allow null
      phone?: string,
      gender?: string,
      email?: string
    ): Observable<BusinessCard[]> {
      const params: any = {};
      if (name) params.name = name;
      if (dateOfBirth !== null) params.dateOfBirth = dateOfBirth?.toISOString(); // Only call toISOString if dob is not null
      if (phone) params.phone = phone;
      if (gender) params.gender = gender;
      if (email) params.email = email;
    
      return this.http.get<BusinessCard[]>(`${this.apiUrl}/filter`, { params });
    }


 // Export business cards to CSV
 exportToCsv(): Observable<Blob> {
  // Adjust the URL as per the API structure
  const exportUrl = `${this.apiUrl}/export/csv`;

  return this.http.get(exportUrl, {
    responseType: 'blob' // Expecting the server to return a Blob (binary data like a file)
  });
}

// Export business cards to XML
exportToXml(): Observable<Blob> {
  const exportUrl = `${this.apiUrl}/export/xml`;

  return this.http.get(exportUrl, {
    responseType: 'blob' // Expecting the server to return a Blob (binary data like a file)
  });
}
 // Import CSV
 importCsv(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file); // Append the file to the FormData object

  return this.http.post(`${this.apiUrl}/import/csv`, formData, {
    reportProgress: true,
    responseType: 'text' // Expect a text response
  });
}

// Import parsed CSV data to the server
importCsvData(csvData: any[]): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post(`${this.apiUrl}/import/csv`, csvData, { headers });
}


}
