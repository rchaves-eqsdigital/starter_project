import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  private toggled: boolean = false;

  @Input()
  back: String;

  constructor(
    private apiService: ApiService,
    private girlScouts: CookieService,
    private router: Router) { }

  ngOnInit(): void { }

  public switchLights(): void {
    if (this.toggled) {
      this.setLight();
    } else {
      this.setDark();
    }
    this.toggled = !this.toggled;
  }

  public logout(): void {
    // Assure there is a token to log out of
    if (this.girlScouts.get("token") == "") {
      return null;
    }
    this.apiService.logout().then((x) => {
      if (x.error || x.ok != "true") {
        if (!environment.production) { console.log("Error logging out:",x.error); }
      } else {
        // Logged out
        if (!environment.production) { console.log("Logging out..."); }
        this.girlScouts.delete("token");
        this.router.navigateByUrl("login");
      }
    }, (x) => {
      // Promise failed
    });
  }

  private setLight(): void {
    document.body.classList.toggle('dark',false);
    document.body.classList.toggle('light',true);
  }

  private setDark(): void {
    document.body.classList.toggle('light',false);
    document.body.classList.toggle('dark',true);
  }

}
