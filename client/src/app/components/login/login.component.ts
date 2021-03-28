import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { ApiService } from '../../api.service';
import { CookieService } from 'ngx-cookie-service';
import { Logging } from 'src/app/logging/logging';

/**
 * Login screen.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /**
   * String to show on screen as error, if login fails.
   */
  private invalidString = "The entered credentials are invalid."

  /**
   * Form structure.
   */
  loginForm = this.formBuilder.group({
    email: '',
    password: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private girlScouts: CookieService
  ) { }

  ngOnInit(): void { }

  /**
   * Called when Login is clicked.
   * 
   * Password is hashed with SHA-256 and passed together with the email
   * to the Login API call.
   * Sign-In button is changed to spin until the server replies.
   * If there is an error, button stops spinning and an error message is
   * displayed.
   * 
   * @returns Void promise.
   */
  async onSubmit(): Promise<void> {
    document.getElementById("errorMsg").innerHTML = "";
    let password = sha256(this.loginForm.value.password);
    // Loading
    let signIn_backup = document.getElementById("signIn").innerHTML;
    document.getElementById("signIn").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    
    this.apiService.login(this.loginForm.value.email, password).then((x) => {
      document.getElementById("signIn").innerHTML = signIn_backup;
      if (x.error) {
        Logging.log("Error logging in: "+x.error);
        // User already logged in.
        if (x.error.toString().includes("user already logged in")){
          this.router.navigateByUrl("sensors");  
        }
        // Loading -> ERROR
        document.getElementById("errorMsg").innerHTML = this.invalidString;
      } else {
        // Loading -> OK
        // Save token in cookie
        this.girlScouts.set("token",x.token);
        this.router.navigateByUrl("sensors");
      }
    }, (x) => {
      // Promise failed
    });
  }
}
