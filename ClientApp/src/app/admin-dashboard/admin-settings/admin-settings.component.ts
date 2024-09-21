import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
})
export class AdminSettingsComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient , private adminServe :AdminService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadIcon(): void {
    if (!this.selectedFile) {
      alert('Please select a file!');
      return;
    }

    const formData = new FormData();
    formData.append('icon', this.selectedFile);

    this.http.post(`${environment.appUrl}/api/admin/upload-icon`, formData).subscribe({
      next: () => {
        Swal.fire("" , "تم تغير أيقونة الموقع بنجاح" , "success")
        this.adminServe.updateFavicon(`${environment.appUrl}/WebsiteIcon/favicon.ico`); 
      }
    });
  }
}
