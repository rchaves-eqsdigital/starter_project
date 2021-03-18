import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges } from '@angular/core';
import { EChartsType, init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

@Component({
  selector: 'app-line-echarts',
  templateUrl: './line-echarts.component.html',
  styleUrls: ['./line-echarts.component.css']
})
export class LineEchartsComponent implements OnInit, OnChanges {

  @Input()
  data: {x:number[],y:number[]};

  @ViewChild('echart', {static: true})
  private canvas: ElementRef;

  private chart: EChartsType = null;

  constructor() { }

  ngOnInit(): void {
    if (this.chart === null) {
      this.echartInit();
    }
  }

  ngOnChanges(): void {
    this.update();
  }

  private echartInit(): void {
    use([LineChart, GridComponent, CanvasRenderer]);
    this.chart = init(this.canvas.nativeElement);
    this.update();
  }

  private update(): void {
    this.ngOnInit(); // Initialize if needed
    let option = {
      tooltip: {},
      xAxis: {
          data: this.data.x
      },
      yAxis: {},
      series: [{
          type: 'line',
          data: this.data.y
      }]
    };

    // use configuration item and data specified to show chart
    this.chart.setOption(option);
  }

}
