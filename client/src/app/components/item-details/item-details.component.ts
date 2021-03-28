import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { Item } from '../../data-structs/item';

/**
 * Semi-generic component to view an Item's details. Supports sensors and users.
 */
@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  /**
   * Item to display the details of.
   */
  item: Item;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  /**
   * Fetch Item details, being able to display an error in the HTML.
   */
  async ngOnInit(): Promise<void> {
    this.getData().then(response => {
      this.item = response;
    }).catch(e => {
      let err = e.status+": "+e.statusText;
      document.getElementById("error").innerHTML=err;
    })
  }

  /**
   * Handles form-edit close.
   * 
   * @param data - new data that was edited.
   */
  formClosed(data) {
    if (data !== null) {
      // Edit was successful
      document.getElementById("data_value").innerHTML = data;
      document.getElementById("data_ok").classList.add("fadeout");
    }
  }

  /**
   * Parse Item type from the URL.
   * 
   * @returns string with Item type.
   */
  getType(): string {
    if (this.route.snapshot.routeConfig.path.split("/")[0].includes("sensor")) {
      return "sensor";
    } else if (this.route.snapshot.routeConfig.path.split("/")[0].includes("user")) {
      return "user";
    } else {
      return "";
    }
  }

  /**
   * @returns string with the previous URL path.
   */
  getBack(): string {
    return this.route.snapshot.routeConfig.path.split("/")[0];
  }

  /**
   * @returns string with ID from the URL path.
   */
  getID(): string {
    return this.route.snapshot.paramMap.get('id');
  }

  /**
   * Fetch Item details from the API, based on the `id` in the URL.
   * 
   * @returns Promise with the fetched Item.
   */
  private getData(): Promise<Item> {
    if (this.getType() == "sensor") {
      return this.apiService.getSensor(this.getID());
    } else if (this.getType() == "user") {
      return this.apiService.getUser(this.getID());
    }
  }

}
