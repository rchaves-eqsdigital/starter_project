import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../api.service';
import { DataEntry } from '../../data-structs/data-entry';
import { Logging } from '../../logging/logging';

/**
 * Component that displays the 3 graphs, when viewing a Sensor's data.
 */
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  /**
   * Sensor data, passed to the respetive graphs' subcomponents.
   */
  data: {x:any[],y:number[]} = {x:[],y:[]};

  /**
   * Sensor ID.
   */
  @Input()
  id: string;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  /**
   * Fetch sensor data on Init.
   */
  ngOnInit(): void {
    this.getData();
  }

  /**
   * Fetch sensor data for sensor with id `id`, from the API. On callback `this.data`
   * is filled with the returned data.
   */
  getData(): void {
    if (!environment.production) { Logging.log(this.router.url); }
    this.apiService.getSensorData(this.id)
        .subscribe((data) => {
          if (!environment.production) { Logging.log("[graph] Got data with len "+data.length); }
          this.data = this.parseDataEntries(data);
        });
  }

  /**
   * Helper function to parse incoming sensor data from the API. Converts from
   * [DataEntry,...] to {x:[DataEntry.Date,...], y:[DataEntry.Temp,...]}.
   * 
   * @param x - DataEntry array to be parsed
   * @returns data in the new format.
   */
  private parseDataEntries(x: DataEntry[]): {x:any[],y:number[]} {
    let ret: {x:any[],y:number[]} = {x:[],y:[]};
    for (let i = 0; i < x.length; i++) {
      const e = x[i];
      ret.x.push(e.Date);
      ret.y.push(e.Temp);
    }
    if (!environment.production) { Logging.log("x["+ret.x.length+"] y["+ret.y.length+"]"); }
    return ret
  }
}
