import {CustomerComponent} from './admin/customer/customer.component';
import {Routes, RouterModule } from '@angular/router';
import { CustomerDetailComponent } from './admin/customer-detail/customer-detail.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'customer',
        pathMatch: 'full'
    },
    {
        path: 'customer',
        component: CustomerComponent
    },
    {
        path: 'customer/detail/:id',
        component: CustomerDetailComponent
    }
]

export const routing = RouterModule.forRoot(routes);




