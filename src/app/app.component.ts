import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BusinessCardFormComponent } from './business-card-form/business-card-form.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,BusinessCardFormComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template:`<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'BusinessCard';
}
