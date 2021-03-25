import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Item } from '../item-list/item';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  item: Item;

  type: string;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.getData().then(response => {
      this.item = response;
    }).catch(e => {
      let err = e.status+": "+e.statusText;
      document.getElementById("error").innerHTML=err;
    })
  }

  getType(): string {
    if (this.route.snapshot.routeConfig.path.split("/")[0].includes("sensor")) {
      return "sensor";
    } else if (this.route.snapshot.routeConfig.path.split("/")[0].includes("user")) {
      return "user";
    } else {
      return "";
    }
  }

  getBack(): string {
    return this.route.snapshot.routeConfig.path.split("/")[0];
  }

  getID(): string {
    return this.route.snapshot.paramMap.get('id');
  }

  private getData(): Promise<Item> {
    if (this.getType() == "sensor") {
      return this.apiService.getSensor(this.getID());
    } else if (this.getType() == "user") {
      return this.apiService.getUser(this.getID());
    }
  }

}
