import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { AuthGuard } from './shared/guards/authorization.guard';
import { CustomerGuard } from './shared/guards/customer.guard';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AuthenticationComponent } from './shared/authentication/authentication.component';
import { VendorGuard } from './shared/guards/vendor.guard';
import { SearchComponent } from './search/search.component';
import { VendorAccountComponent } from './vendor/vendor.component';
import { BuyAndSearchComponent } from './buy-and-search/buy-and-search.component';
import { ProductComponent } from './product/product.component';
export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "about", component: AboutComponent },
    { path: "contact", component: ContactComponent },
    {
        path: "",
        canActivate: [AuthGuard],
        children: [{
            path: "vendor", component: VendorAccountComponent,
            loadChildren: () => import("./vendor/vendor-routing.module").then(x => x.VendorRoutingModule)
        }]
    },
    { path: "account", loadChildren: () => import("./account/account.module").then(m => m.AccountModule) },
    { path: "not-found", component: NotFoundComponent },
    { path: "search", component: SearchComponent },
    { path: "authentication", component: AuthenticationComponent },
    { path: "Vendor-Profile" , component:BuyAndSearchComponent},
    { path: "product" , component:ProductComponent},
    { path: "**", component: NotFoundComponent, pathMatch: 'full' }
];
