import { RouterModule, Routes } from '@angular/router';
import { BusinessCardFormComponent } from './business-card-form/business-card-form.component';
import { CreateBusinessCardComponent } from './create-business-card/create-business-card.component';
import { NgModule } from '@angular/core';




// Declare and export the routes
export const routes: Routes = [
    { path: 'business-card-form', component: BusinessCardFormComponent },
    { path: 'create-business-card', component: CreateBusinessCardComponent },
    { path: '', redirectTo: '/business-card-form', pathMatch: 'full' }  // Default route
  ];
 //@NgModule({
   // imports: [RouterModule.forRoot(routes)],
   // exports: [RouterModule]
 // })

 // export class AppRoutingModule { }
