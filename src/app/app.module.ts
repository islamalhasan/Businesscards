import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BusinessCardService } from './Service/business-card.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { BusinessCardFormComponent } from './business-card-form/business-card-form.component';
import { EditBusinessCardComponent } from './edit-business-card/edit-business-card.component';





@NgModule({
    declarations: [
     // Declare AppComponent here
     // Declare your BusinessCardFormComponent

     
        
    ],
    imports: [
        BrowserModule, // Include BrowserModule for browser support
        AppComponent,
        FormsModule,
        NgxSpinnerModule,
        RouterModule.forRoot(routes)  // Configures routing
    ],
    providers: [BusinessCardService,provideHttpClient()], // Add any services here if needed
    bootstrap: []  // Start with the AppComponent when the app loads


})
export class AppModule { }