import { Component, OnInit } from '@angular/core';
import { Sensor } from './sensor';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  sensors: Sensor[] = [];

  constructor() { }

  ngOnInit(): void {
    this.sensors = [
      new Sensor("","SensorABC"),
      new Sensor("","Sensor Whitespace"),
      new Sensor(null,"Sensor Max")
    ];
  }

}
