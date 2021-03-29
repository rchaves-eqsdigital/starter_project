import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Logging } from 'src/app/logging/logging';
import { ApiService } from '../../api.service';

/**
 * Top nav-bar, with dark mode switch, user and logout.
 */
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  /**
   * Boolean with the toggle-button state.
   */
  private toggled: boolean = false;

  /**
   * If `back` is not null, a back arrow is displayed, routing to `back`
   * when clicked.
   */
  @Input()
  back: String;

  constructor(
    private apiService: ApiService,
    private girlScouts: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateUsername();
  }

  /**
   * Toggle between dark and light mode, analogous to an IRL
   * light switch flip.
   */
  public switchLights(): void {
    if (this.toggled) {
      this.setLight();
    } else {
      this.setDark();
    }
    this.toggled = !this.toggled;
  }

  /**
   * Logout, called when the logout icon is clicked.
   */
  public logout(): void {
    // Assure that there is a token to log out of
    if (this.girlScouts.get("token") == "") {
      return;
    }
    this.apiService.logout().then((x) => {
      if (x.error || x.ok != "true") {
        Logging.log("Error logging out: "+x.error);
      } else {
        // Logged out
        Logging.log("Logging out...");
        this.girlScouts.delete("token");
        this.router.navigateByUrl("login");
      }
    }, (x) => {
      // Promise failed
    });
  }

  /**
   * Change dark mode to light.
   */
  private setLight(): void {
    document.body.classList.toggle('dark',false);
    document.body.classList.toggle('light',true);
  }

  /**
   * Change light mode to dark.
   */
  private setDark(): void {
    document.body.classList.toggle('light',false);
    document.body.classList.toggle('dark',true);
  }

  /**
   * Display username of logged in user.
   */
  private updateUsername(): void {
    // Get username from token
    console.log(this.girlScouts.get("token"));
    let partial_token = this.girlScouts.get("token").substring(0,8);
    this.apiService.getUserFromTok(partial_token).then(response => {
      // Fill "username" with username
      document.getElementById("username").innerHTML = response.Name;
    }).catch(e => Logging.log(e));
  }

}
