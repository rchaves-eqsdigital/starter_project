import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  
  data: {x:number[],y:number[]} = {x:[],y:[]};

  constructor() { }

  ngOnInit(): void {
    this.data.x = [0,1,2,3,4,5];
    this.data.y = [5, 20, 36, 10, 10, 20];
  }
}
