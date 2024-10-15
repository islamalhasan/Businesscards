// src/app/models/business-card.model.ts
export interface BusinessCard {
    id: number;
    name: string;
    gender: string; // Added gender
    dateOfBirth?: Date | null; // Added date of birth, optional
    email: string;
    phone: string;
    address: string;
    photo?: string; // Optional for photo URL
    notes?: string; // Optional for additional notes
    qrCode?: string; 
    UserId?: number;// Optional for QR code data

}