import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  constructor(private router: Router) {}

isSidebarOpen: boolean = false; // Tracks sidebar state

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar open/close
}
}
