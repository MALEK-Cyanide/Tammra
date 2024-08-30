import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { AuthGuard } from './shared/guards/authorization.guard';
import { PlayComponent } from './play/play.component';
export const routes: Routes = [
    {path:"" ,component:HomeComponent},
    {path:"",
        runGuardsAndResolvers:"always",
        canActivate:[AuthGuard],
        children:[{
            path:"play" , component:PlayComponent
        }]
    },
    {path:"account" , loadChildren:() => import("./account/account.module").then(m => m.AccountModule)},
    {path:"not-found" ,component:NotFoundComponent},
    {path:"**" ,component:NotFoundComponent , pathMatch :'full'}
];
