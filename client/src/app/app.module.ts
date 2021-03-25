import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { SensorsComponent } from './sensors/sensors.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { AppRoutingModule } from './app-routing.module';
import { FloatButtonComponent } from './float-button/float-button.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { GraphComponent } from './graph/graph.component';
import { LineEchartsComponent } from './line-echarts/line-echarts.component';
import { LineChartjsComponent } from './line-chartjs/line-chartjs.component';
import { LineCanvasComponent } from './line-canvas/line-canvas.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    SensorsComponent,
    BottomNavComponent,
    TopNavComponent,
    FloatButtonComponent,
    ItemListComponent,
    ItemDetailsComponent,
    GraphComponent,
    LineEchartsComponent,
    LineChartjsComponent,
    LineCanvasComponent,
    ItemFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
