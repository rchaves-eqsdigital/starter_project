import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  private toggled: boolean = false;

  @Input()
  back: String;

  constructor() { }

  ngOnInit(): void { }

  public switchLights(): void {
    if (this.toggled) {
      this.setLight();
    } else {
      this.setDark();
    }
    this.toggled = !this.toggled;
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
