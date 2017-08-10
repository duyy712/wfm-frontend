import { CustomerComponent } from './admin/customer/customer.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'customer',
        pathMatch: 'full'
    },
    {
        path: 'customer',
        component: CustomerComponent
    }
]

export const routing = RouterModule.forRoot(routes);




