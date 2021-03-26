import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { SensorsComponent } from './components/sensors/sensors.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { FloatButtonComponent } from './components/float-button/float-button.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { GraphComponent } from './components/graph/graph.component';
import { LineEchartsComponent } from './components/line-echarts/line-echarts.component';
import { LineChartjsComponent } from './components/line-chartjs/line-chartjs.component';
import { LineCanvasComponent } from './components/line-canvas/line-canvas.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthInterceptor } from './routing/auth-interceptor';
import { Four04Component } from './components/four04/four04.component';

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
    ItemFormComponent,
    Four04Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [CookieService,
  {
    provide: HTTP_INTERCEPTORS,
    useFactory: function(router: Router) {
      return new AuthInterceptor(router);
    },
    multi: true,
    deps: [Router]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
