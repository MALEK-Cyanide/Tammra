import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FavComponent } from './fav/fav.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { ChargeComponent } from './charge/charge.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  { path: 'fav', component: FavComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'orders-list', component: OrdersComponent },
  { path: 'charge/:id', component: ChargeComponent },
  { path: 'order-items/:id', component:  OrderDetailsComponent},

]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes),
    CommonModule
  ]
})
export class CoustomerRoutingModule { }
