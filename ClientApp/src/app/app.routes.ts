import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { AuthGuard } from './shared/guards/authorization.guard';
import { PlayModule } from './Play/play.module';
import { CustomerGuard } from './shared/guards/customer.guard';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
export const routes: Routes = [
    {path:"" ,component:HomeComponent},
    {path:"about" , component:AboutComponent},
    {path:"contact" , component:ContactComponent},
    {path:"",
        canActivate:[AuthGuard , CustomerGuard],
        children:[{
            path:"play" , loadChildren:() => import("./Play/play.module").then(m => PlayModule)
        }]
    },
    {path:"account" , loadChildren:() => import("./account/account.module").then(m => m.AccountModule)},
    {path:"not-found" ,component:NotFoundComponent},
    {path:"**" ,component:NotFoundComponent , pathMatch :'full'}
];
