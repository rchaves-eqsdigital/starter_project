import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../api.service';
import { Logging } from '../../logging/logging';
import { Sensor } from '../../data-structs/sensor';

/**
 * Component shown in /sensors, shows a list of sensors.
 */
@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  /**
   * Array of sensors, to be populated by this.getData().
   */
  sensors: Sensor[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  /**
   * Fetches the list of sensors from the API, saving it in `this.sensors`.
   */
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
