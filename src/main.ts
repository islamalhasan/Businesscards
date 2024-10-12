import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { BusinessCardFormComponent } from './app/business-card-form/business-card-form.component';


bootstrapApplication(AppComponent,{
  providers: [
    provideHttpClient()  // Example of adding HttpClient support
  ]
}).catch(err => console.error(err));



