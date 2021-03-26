import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges } from '@angular/core';
import { EChartsType, init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

/**
 * Component to draw a line chart using ECharts.
 */
@Component({
  selector: 'app-line-echarts',
  templateUrl: './line-echarts.component.html',
  styleUrls: ['./line-echarts.component.css']
})
export class LineEchartsComponent implements OnInit, OnChanges {
  
  /**
   * Data to be drawn.
   */
  @Input()
  data: {x:number[],y:number[]};

  /**
   * Canvas element.
   */
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

  /**
   * Initialize ECharts variable, creating a line chart with a grid.
   */
  private echartInit(): void {
    use([LineChart, GridComponent, CanvasRenderer]);
    this.chart = init(this.canvas.nativeElement);
  }

  /**
   * Update chart with the data. Line is drawn in `--brand-normal` and grid in
   * `--gray-2`.
   */
  private update(): void {
    this.ngOnInit(); // Initialize if needed
    let option = {
      tooltip: {},
      xAxis: {
          data: this.data.x,
          splitLine: {
            lineStyle: {
              color: getComputedStyle(document.querySelector('body')).getPropertyValue('--gray-2')
            }
          }
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            color: getComputedStyle(document.querySelector('body')).getPropertyValue('--gray-2')
          }
        }
      },
      series: [{
          type: 'line',
          color: getComputedStyle(document.querySelector('body')).getPropertyValue('--brand-normal'),
          data: this.data.y
      }]
    };

    // use configuration item and data specified to show chart
    this.chart.setOption(option);
  }

}
