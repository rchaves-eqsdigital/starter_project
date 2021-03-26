import { Component, OnInit } from '@angular/core';

/**
 * Bottom nav-bar, displaying the navigation menu. Currently `/users` and `/sensors`.
 */
@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNavComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
