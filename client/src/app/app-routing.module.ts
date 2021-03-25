import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Four04Component } from './four04/four04.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { LoginComponent } from './login/login.component';
import { SensorsComponent } from './sensors/sensors.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent},
  { path: 'users/:id', component: ItemDetailsComponent},
  { path: 'sensors', component: SensorsComponent},
  { path: 'sensors/:id', component: ItemDetailsComponent},
  { path: '**', component: Four04Component}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
