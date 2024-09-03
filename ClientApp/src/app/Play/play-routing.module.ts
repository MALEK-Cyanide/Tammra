import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GetPlayerComponent } from './get-player/get-player.component';
// import { AdminGuard } from '../shared/guards/admin.guard';

const routes: Routes = [
  {path:"get-player" ,component:GetPlayerComponent,
    runGuardsAndResolvers:"always",
    // canActivate: [AdminGuard],
},]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class PlayRoutingModule {

}
