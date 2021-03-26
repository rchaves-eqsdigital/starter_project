import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../../data-structs/item';

/**
 * Generic component that shows a list of Items.
 */
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  /**
   * List of Items to be displayed.
   */
  @Input()
  items: Item[] = [];

  /**
   * Default icon for each item, when that Item does not have a Pic.
   */
  @Input()
  defaultIcon: String;

  /**
   * Current URL.
   */
  href: String;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.href = this.router.url;
  }

}
