import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as chart from 'chart.js';

@Component({
  selector: 'app-line-chartjs',
  templateUrl: './line-chartjs.component.html',
  styleUrls: ['./line-chartjs.component.css']
})
export class LineChartjsComponent implements OnInit {

  @ViewChild('canvas', {static: true})
	public canvas: ElementRef;
  //public data: {x: any, y: any}[] = null;
  public context: CanvasRenderingContext2D = null;
	public chart: chart.Chart = null;
	public dataset: chart.ChartData = null;

  @Input()
  data: {x:number[],y:number[]};

  constructor() { }

  ngOnInit(): void {
    this.chartjsInit('g_chart');
  }

  private chartjsInit(id: string): void {
    this.dataset = {
			labels: [],
			datasets: [{
				data: [],
				backgroundColor: '',
				borderColor: '',
				fill: 'origin'
			}]
		};

    const color: string = '#f00';

    this.dataset.datasets[0].data = this.rollUp(this.data.x,this.data.y);
    this.dataset.datasets[0].backgroundColor = color + '33';
    this.dataset.datasets[0].borderColor = color;

    this.context = this.canvas.nativeElement.getContext('2d');
    chart.Chart.register(chart.LineController, chart.LineElement, chart.PointElement, chart.LinearScale, chart.Title);
    this.chart = new chart.Chart(this.context, {
			type: 'line',
			data: this.dataset,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				elements: {line: {tension: 0}},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				plugins: {
					title: {display: false},
					legend: {display: false},
					tooltip: {
						mode: 'index',
						intersect: false
					}
				},
        scales: {
					x: {
						type: 'linear'
					}
				},
				interaction: {mode: 'nearest'}
			}
		});
  }

  private rollUp(x_arr: number[], y_arr: number[]): {x: any, y: any}[] {
    let ret = [];
    if (x_arr.length != y_arr.length) {
      console.log("x:"+x_arr+", y:"+y_arr);
      return null;
    }
    for (let i = 0; i < x_arr.length; i++) {
      let elem = {x:x_arr[i],y:y_arr[i]}
      ret.push(elem);
    }
    return ret;
  }

}
