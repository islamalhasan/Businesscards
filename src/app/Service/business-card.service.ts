import { HttpClient } from '@angular/common/http';
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

}
