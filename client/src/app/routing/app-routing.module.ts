import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Four04Component } from '../components/four04/four04.component';
import { ItemDetailsComponent } from '../components/item-details/item-details.component';
import { LoginComponent } from '../components/login/login.component';
import { SensorsComponent } from '../components/sensors/sensors.component';
import { UsersComponent } from '../components/users/users.component';

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
