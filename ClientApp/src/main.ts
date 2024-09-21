import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.development';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

export class Index {
  url = `${environment.appUrl}/WebsiteIcon/favicon.png`
  icon = "/Images/dates_9622184.png";
}