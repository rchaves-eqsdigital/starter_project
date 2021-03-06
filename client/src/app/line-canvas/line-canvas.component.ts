import { Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-canvas',
  templateUrl: './line-canvas.component.html',
  styleUrls: ['./line-canvas.component.css']
})
export class LineCanvasComponent implements OnInit {

  @Input()
  data: {x:number[],y:number[]};

  @ViewChild('canvas', {static: true})
  private canvas: ElementRef;

  // "normal" coordinates, (0,0) at bottom left, y' positive up, x' positive right
  private pos: {x:number,y:number} = {x:0,y:0};
  // real pos
  private pos_r: {x:number,y:number} = {x:0,y:0};

  constructor() { }

  ngOnInit(): void {
    this.canvasRun();
  }

  private canvasRun(): void {
    let canvas = this.canvas.nativeElement;
    let ctx = this.setupCanvas(canvas);
    ctx.lineWidth = 2;

    function m(a,b) {
      return Math.max(a,b);
    }
    let max_x = this.data.x.reduce(m);
    let max_y = this.data.y.reduce(m);

    let x_scale = (canvas.width-5)/max_x;
    let y_scale = (canvas.height)/max_y;

    // Confirm that both data arrays have equal length
    if (this.data.x.length != this.data.y.length) {
      console.error("x:"+this.data.x+", y:"+this.data.y);
      return;
    }

    this.c_init(ctx,canvas.width,canvas.height);
    this.drawGrid(ctx,canvas.width,canvas.height);
    for (let i = 0; i < this.data.x.length; i++) {
      let x = this.data.x[i];
      let y = this.data.y[i];
      let d_x = (x*x_scale)-this.pos.x;
      let d_y = (y*y_scale)-y-this.pos.y;
      this.line(ctx,d_x,d_y);
      this.arc(ctx,d_x,d_y,2);
    }
    ctx.stroke();
  }

  private c_init(ctx: CanvasRenderingContext2D, c_x: number, c_y: number, x_off: number=0, y_off: number=0): void {
    this.pos.x = 0;
    this.pos.y = 0;
    this.pos_r.x = 0.5+x_off;
    this.pos_r.y = c_y-y_off;
    ctx.beginPath();
    ctx.moveTo(this.pos_r.x, this.pos_r.y);
  }

  private drawGrid(ctx: CanvasRenderingContext2D, canvas_w: number, canvas_h: number): void {
    ctx.closePath();
    ctx.save();

    ctx.lineWidth = 1;
    ctx.strokeStyle="rgba(0,0,0,0.3)";
    ctx.beginPath();
    let h_s = 62; // TODO: I think this is not accurate for every canvas size
    // Vertical lines
    for (let i = 0; (this.pos_r.x+(i*h_s))<canvas_w; i++) {
      ctx.moveTo(this.pos_r.x+(i*h_s), this.pos_r.y);
      ctx.lineTo(this.pos_r.x+(i*h_s),0);
    }
    // Horizontal lines
    let v_s = 37; // TODO: I think this is not accurate for every canvas size
    for (let i = 0; i<20; i++) {
      ctx.moveTo(0,this.pos_r.y-(i*v_s));
      ctx.lineTo(canvas_w,this.pos_r.y-(i*v_s));
    }
    // Reset "pointer"
    ctx.moveTo(this.pos_r.x, this.pos_r.y);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
    ctx.beginPath();
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

  private setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
  }

}
