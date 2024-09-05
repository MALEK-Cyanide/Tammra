import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../../home/home.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [HomeComponent,
    RouterModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {

}
