import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
