import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeModule } from './admin/customer/prime.module';
import { DataModelService } from './admin/data-model.service';
import { AppComponent } from './app.component';
import { CustomerComponent } from './admin/customer/customer.component';
import { routing } from './app.routes';
import { CustomerDetailComponent } from './admin/customer-detail/customer-detail.component';
import { DxDataGridModule } from 'devextreme-angular';
import { CustomerSortPipe } from './admin/customer/customer-sort.pipe';
import {AccordionModule} from 'primeng/primeng';



@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    CustomerDetailComponent,
    CustomerSortPipe,
  ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    NgbModule.forRoot(),
    BreezeBridgeAngularModule,
    DxDataGridModule,
    FileUploadModule,
    CommonModule,
    BrowserAnimationsModule,
    PrimeModule,
    AccordionModule
  ],
  providers: [DataModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
