import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { DataEntry } from '../data-entry';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  
  data: {x:number[],y:number[]} = {x:[],y:[]};
  data_entries: DataEntry[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.router.url);
    this.getData();
    this.data.x = [0,1,2,3,4,5];
    this.data.y = [5, 20, 36, 10, 10, 20];
  }

  getData(): void {
    //console.log(this.router.url);
    this.apiService.getSensorData("3")
        .subscribe((data) => {this.data_entries = data; console.log(data); console.log(data[0].Temp)});
  }
}
