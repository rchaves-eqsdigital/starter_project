import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
//import { Chart, ChartData } from 'chart.js';
import * as chart from 'chart.js';
import { init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  
  private data_x: number[];
  private data_y: number[];

  constructor() { }

  ngOnInit(): void {
    //this.data_x = ["shirt","cardign","chiffon shirt","pants","heels","socks"]
    this.data_x = [0,1,2,3,4,5];
    this.data_y = [5, 20, 36, 10, 10, 20];
    this.echartInit('g_echart');
    this.chartjsInit('g_chart');
    this.canvasInit('g_canvas');
  }

  private echartInit(id: string): void {
    use([LineChart, GridComponent, CanvasRenderer]);
    var myChart = init(document.getElementById(id));
    var option = {
      tooltip: {},
      xAxis: {
          data: this.data_x
      },
      yAxis: {},
      series: [{
          type: 'line',
          data: this.data_y
      }]
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);

    window.addEventListener('resize',function(){
      myChart.resize();
    })
  }

  /************* CHARTJS  *************/
  @ViewChild('canvas', {static: true})
	public canvas: ElementRef;
  public data: {x: any, y: any}[] = null;
  public context: CanvasRenderingContext2D = null;
	public chart: chart.Chart = null;
	public dataset: chart.ChartData = null;

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

    this.dataset.datasets[0].data = this.rollUp([0,1,2,3,4,5],this.data_y);
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

  /***************** CANVAS ******************/

  private canvasInit(id: string): void {
    let canvas = document.getElementById(id) as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");

    function m(a,b) {
      return Math.max(a,b);
    }
    let max_x = this.data_x.reduce(m);
    let max_y = this.data_y.reduce(m);

    let x_scale = (canvas.width-5)/max_x;
    let y_scale = (canvas.height)/max_y;

    // Confirm that both data arrays have equal length
    if (this.data_x.length != this.data_y.length) {
      console.error("x:"+this.data_x+", y:"+this.data_y);
      return;
    }

    this.c_init(ctx,canvas.width,canvas.height);
    for (let i = 0; i < this.data_x.length; i++) {
      let x = this.data_x[i];
      let y = this.data_y[i];
      let d_x = (x*x_scale)-this.pos.x;
      let d_y = (y*y_scale)-y-this.pos.y;
      this.line(ctx,d_x,d_y);
      this.arc(ctx,d_x,d_y,2);
    }
    ctx.stroke();
  }

  private pos: {x:number,y:number} = {x:0,y:0};
  private pos_r: {x:number,y:number} = {x:0,y:0}; // real pos

  private c_init(ctx: CanvasRenderingContext2D, c_x: number, c_y: number, x_off: number=0, y_off: number=0): void {
    this.pos.x = 0;
    this.pos.y = 0;
    this.pos_r.x = 0.5+x_off;
    this.pos_r.y = c_y-y_off;
    ctx.beginPath();
    ctx.moveTo(this.pos_r.x, this.pos_r.y);
  }

  // Draws line on `ctx` starting from the current position
  private line(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    this.pos.x += x;
    this.pos.y += y;
    this.pos_r.x += x;
    this.pos_r.y -= y;
    ctx.lineTo(this.pos_r.x, this.pos_r.y);
  }

  private arc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    //ctx.stroke();
    //ctx.closePath();

    //ctx.beginPath();
    ctx.arc(this.pos_r.x,this.pos_r.y,r,0,2*Math.PI);
    //ctx.closePath();
    //ctx.stroke();
    
    //ctx.beginPath();
    ctx.moveTo(this.pos_r.x,this.pos_r.y);
  }


  /*********** AUX **********************/
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
