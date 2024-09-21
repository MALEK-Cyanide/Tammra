import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-change',
  standalone: true,
  imports: [RouterLink,RouterModule],
  templateUrl: './change.component.html',
  styleUrl: './change.component.css'
})
export class ChangeComponent {

}
