import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { AuthGuard } from './shared/guards/authorization.guard';
import { CustomerGuard } from './shared/guards/customer.guard';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AuthenticationComponent } from './shared/authentication/authentication.component';
import { VendorGuard } from './shared/guards/vendor.guard';
import { ProductComponent } from './product/product.component';
import { AllProductComponent } from './product/all-product/all-product.component';
import { SearchComponent } from './search/search.component';
export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "about", component: AboutComponent },
    { path: "contact", component: ContactComponent },
    {
        path: "",
        canActivate: [AuthGuard, VendorGuard],
        children: [{
            path: "product", component: ProductComponent,
            loadChildren: () => import("./product/product-routing.module").then(m => m.ProductRoutingModule)
        }]
    },
    { path: "account", loadChildren: () => import("./account/account.module").then(m => m.AccountModule) },
    { path: "not-found", component: NotFoundComponent },
    { path: "search", component: SearchComponent },
    { path: "authentication", component: AuthenticationComponent },
    { path: "**", component: NotFoundComponent, pathMatch: 'full' }
];
