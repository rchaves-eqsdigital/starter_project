import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges } from '@angular/core';
import * as chart from 'chart.js';
import { environment } from 'src/environments/environment';
import { Logging } from '../../logging/logging';

/**
 * Component to draw a line chart using ChartJS.
 */
@Component({
  selector: 'app-line-chartjs',
  templateUrl: './line-chartjs.component.html',
  styleUrls: ['./line-chartjs.component.css']
})
export class LineChartjsComponent implements OnInit, OnChanges {

  /**
   * Canvas element.
   */
  @ViewChild('canvas', {static: true})
  public canvas: ElementRef;

  /**
   * ChartJS variables.
   */
  public context: CanvasRenderingContext2D = null;
  public chart: chart.Chart = null;
  public dataset: chart.ChartData = null;

  /**
   * Data to be drawn.
   */
  @Input()
  data: {x:number[],y:number[]};

  constructor() { }

  ngOnInit(): void {
    if (this.chart === null) {
      this.chartjsInit();
    }
  }

  /**
   * If something changes, the chart is updated.
   */
  ngOnChanges(): void {
    this.chartjsUpdate();
  }

  /**
   * Initialization of ChartJS. Chart color is set to `--brand-normal` and a 
   * responsive line chart is created. Linear scales.
   */
  private chartjsInit(): void {
    const color: string = getComputedStyle(document.querySelector('body')).getPropertyValue('--brand-normal');
    this.dataset = {
			labels: [],
			datasets: [{
				data: this.rollUp(this.data.x,this.data.y),
				backgroundColor: color + '33',
				borderColor: color,
				fill: 'origin'
			}]
		};
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
            gridLines: {
              color: getComputedStyle(document.querySelector('body')).getPropertyValue('--gray-2')
            },
						type: 'linear' // TODO: fix!, get this working with time
					},
          y: {
            gridLines: {
              color: getComputedStyle(document.querySelector('body')).getPropertyValue('--gray-2')
            }
          }          
				},
				interaction: {mode: 'nearest'}
			}
		});
  }

  /**
   * Update the dataset if required, updating the chart afterwards.
   */
  private chartjsUpdate(): void {
    this.ngOnInit(); // Initialize if needed
    for (let i = 0; i < this.data.x.length; i++) { // WIP: Duct tape ^
      this.data.x[i] = i;
    }
    this.dataset.datasets[0].data = this.rollUp(this.data.x,this.data.y);
    this.chart.update();
  }

  /**
   * Auxiliary function to convert x[],y[] to a {x, y}[] format,
   * as required by ChartJS.
   * 
   * @param x_arr - Array with the X data.
   * @param y_arr - Array with the Y data.
   * @returns - Data in the new format.
   */
  private rollUp(x_arr: number[], y_arr: number[]): {x: any, y: any}[] {
    let ret = [];
    if (x_arr.length != y_arr.length) {
      if (!environment.production) {
        Logging.log("x:"+x_arr+", y:"+y_arr);
      }
      return null;
    }
    for (let i = 0; i < x_arr.length; i++) {
      let elem = {x:x_arr[i],y:y_arr[i]}
      ret.push(elem);
    }
    return ret;
  }

}
