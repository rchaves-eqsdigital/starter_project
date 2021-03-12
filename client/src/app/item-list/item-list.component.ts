import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from './item';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  @Input()
  items: Item[] = [];

  @Input()
  defaultIcon: String;

  href: String;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.href = this.router.url;
  }

}
