import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../item-list/item';
import { User } from '../users/user';
import { Sensor } from '../sensors/sensor';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  item: Item;

  type: String;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    //this.item = this.getID();
    if (this.getBack() == "users") {
      var pic: String = "data:image/jpeg;base64,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";
      this.item = new User(pic,"User 2","user2@mail.com","456");
    } else {
      this.item = new Sensor(null,"Sensor aijdij");
    }
  }

  getID(): String {
    return this.route.snapshot.paramMap.get('id');
  }

  getBack(): String {
    return this.route.snapshot.routeConfig.path.split("/")[0]
  }

}
