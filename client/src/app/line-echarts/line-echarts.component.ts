import { Component, Input, OnInit } from '@angular/core';
import { init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

@Component({
  selector: 'app-line-echarts',
  templateUrl: './line-echarts.component.html',
  styleUrls: ['./line-echarts.component.css']
})
export class LineEchartsComponent implements OnInit {

  @Input()
  data: {x:number[],y:number[]};

  constructor() { }

  ngOnInit(): void {
    this.echartInit('g_echart');
  }

  private echartInit(id: string): void {
    use([LineChart, GridComponent, CanvasRenderer]);
    var myChart = init(document.getElementById(id));
    var option = {
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
    myChart.setOption(option);

    window.addEventListener('resize',function(){
      myChart.resize();
    })
  }

}
