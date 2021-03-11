import { Component, Input, OnInit } from '@angular/core';
import { Item } from './item';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  @Input()
  items: Item[] = []

  @Input()
  child: String = ''; // next component when clicked

  constructor() { }

  ngOnInit(): void {
    
  }

}
