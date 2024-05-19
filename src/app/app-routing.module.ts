import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './entities/components/home/home.component';
import { TableRouteComponent } from './entities/components/table-route/table-route.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'table', component: TableRouteComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
