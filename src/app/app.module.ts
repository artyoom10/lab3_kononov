import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DxTemplateModule, DxDataGridModule, DxSelectBoxModule, DevExtremeModule, DxValidationSummaryModule, DxValidationGroupModule, DxFormModule  } from 'devextreme-angular'; 
import { AppComponent } from './app.component';
import { HomeComponent } from './entities/components/home/home.component';
import { TableRouteComponent } from './entities/components/table-route/table-route.component';
import { AppRoutingModule } from './app-routing.module';
import { DxPopupModule } from 'devextreme-angular/ui/popup';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableRouteComponent
  ],
  imports: [
    DxPopupModule,
    AppRoutingModule,
    DxTemplateModule,
    DxFormModule,
    DevExtremeModule,
    DxSelectBoxModule,
    DxValidationSummaryModule,
    DxValidationGroupModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'table', component: TableRouteComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ]),
    DxDataGridModule // Добавляем модуль DxDataGridModule в imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
