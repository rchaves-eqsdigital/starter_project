import { Component, OnInit } from '@angular/core';
import { 
  Chart,
  Legend,
  Title,
  Tooltip
} from 'chart.js';
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
  
  private data_x: string[];
  private data_y: number[];

  constructor() { }

  ngOnInit(): void {
    this.data_x = ["shirt","cardign","chiffon shirt","pants","heels","socks"]
    this.data_y = [5, 20, 36, 10, 10, 20]
    this.echartInit('g_echart');
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

}
