import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { sha256 } from 'js-sha256';
import { ApiService } from 'src/app/api.service';
import { Logging } from 'src/app/logging/logging';

/**
 * Floating "plus" button. When clicked shows a form to add a new entry of the current page's type.
 * Eg: If in /users, register a new user. If in /sensors, register a new sensor.
 * 
 * Not implemented.
 */
@Component({
  selector: 'app-float-button',
  templateUrl: './float-button.component.html',
  styleUrls: ['./float-button.component.css']
})
export class FloatButtonComponent implements OnInit {

  /**
   * Email textbox.
   */
  @ViewChild("emailbox")
  email: ElementRef;

  /**
   * User name textbox.
   */
  @ViewChild("namebox")
  username: ElementRef;

  /**
   * Password textbox.
   */
  @ViewChild("passbox")
  password: ElementRef;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.initModal();
  }

  /**
   * Setup the modal that is shown when then "Edit" button is clicked.
   */
  private initModal(): void {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("triggerButton");

    // Get the <span> element that closes the modal
    var span = document.getElementById("close");

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    } 
  }

  /**
   * Form submission function. Sends add request to the API.
   */
  public async formClick(): Promise<void> {
    let name = this.username.nativeElement.value;
    let email = this.email.nativeElement.value;
    if (this.password.nativeElement.value === "" || name === "" || email === ""){
      alert("Fill every field.");
      return;
    }
    let password = sha256(this.password.nativeElement.value);
    this.apiService.addUser(name,email,password).then((x) => {
      if (x.error) {
        Logging.log("Error logging in: "+x.error);
      } else {
        alert("User created.");
        document.getElementById("myModal").style.display = "none";
      }
    }, (x) => {
      // Promise failed
    });
  }

}
