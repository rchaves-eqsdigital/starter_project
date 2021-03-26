import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../api.service';
import { Logging } from '../../logging/logging';
import { Sensor } from '../../data-structs/sensor';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  sensors: Sensor[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.apiService.getSensors()
        .subscribe((data) => {
          if (!environment.production) { Logging.log("[sensors] Got data with len "+data.length); }
          for (let i = 0; i < data.length; i++) {
            data[i] = new Sensor(null,data[i].ID,data[i].RoomID);
          }
          this.sensors = data;
        });
  }
}
