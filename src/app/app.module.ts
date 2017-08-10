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
import { DataModelService } from './admin/data-model.service';
import { AppComponent } from './app.component';
import { CustomerComponent } from './admin/customer/customer.component';
import { routing } from './app.routes';
import { DxDataGridModule } from 'devextreme-angular';
import { CustomerSortPipe } from './admin/customer/customer-sort.pipe';



@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
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
  ],
  providers: [DataModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
