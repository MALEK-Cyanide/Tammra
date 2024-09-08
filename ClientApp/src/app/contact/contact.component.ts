import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AboutComponent } from '../about/about.component';
import { FooterComponent } from '../new footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ HomeComponent,
    AboutComponent,
    ContactComponent,
  FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  signupForm = new FormGroup({
    phoneNumber: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
  });

  onSubmit() {
    // ...
  }
}

