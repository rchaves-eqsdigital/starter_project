import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { DataEntry } from '../data-entry';
import { Logging } from '../logging';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  
  data: {x:any[],y:number[]} = {x:[],y:[]};

  @Input()
  id: string;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    if (!environment.production) { Logging.log(this.router.url); }
    this.apiService.getSensorData(this.id)
        .subscribe((data) => {
          if (!environment.production) { Logging.log("[graph] Got data with len "+data.length); }
          this.data = this.parseDataEntries(data);
        });
  }

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
