import { Component, ElementRef, Input, ViewChild, OnInit, OnChanges } from '@angular/core';

/**
 * Component to draw a line chart using only the canvas.
 */
@Component({
  selector: 'app-line-canvas',
  templateUrl: './line-canvas.component.html',
  styleUrls: ['./line-canvas.component.css']
})
export class LineCanvasComponent implements OnInit, OnChanges {

  /**
   * Data to be drawn.
   */
  @Input()
  data: {x:number[],y:number[]}; // TODO: Data is already in the right format thanks to `line-chartjs.component.ts`

  /**
   * Canvas element.
   */
  @ViewChild('canvas', {static: true})
  private canvas: ElementRef;

  /**
   * "Normal" coordinates, (0,0) at bottom left, y' positive up, x' positive right
   */
  private pos: {x:number,y:number} = {x:0,y:0};
  /**
   * Real canvas coordinates.
   */
  private pos_r: {x:number,y:number} = {x:0,y:0};

  /* ANIMATION */
  private start = null;
  private prev_i = 0;
  private max_duration = 1500; // ms
  private x_scale = null;
  private y_scale = null;
  private ctx = null;

  constructor() { }

  ngOnInit(): void {
    if (this.data.x.length > 0) {
      this.canvasRun();
    }
  }

  ngOnChanges(): void {
    if (this.data.x.length > 0) {
      this.canvasRun();
    }
  }

  /**
   * Get canvas context, prepare everything for drawing and start the draw animation.
   */
  private canvasRun(): void {
    let canvas = this.canvas.nativeElement;
    let ctx = this.setupCanvas(canvas);
    this.ctx = ctx;
    ctx.lineWidth = 2;

    function m(a,b) {
      return Math.max(a,b);
    }
    let max_x = this.data.x.reduce(m);
    let max_y = this.data.y.reduce(m);

    this.x_scale = (canvas.width-5)/max_x;
    this.y_scale = (canvas.height)/max_y;

    // Confirm that both data arrays have equal length
    if (this.data.x.length != this.data.y.length) {
      console.error("x:"+this.data.x+", y:"+this.data.y);
      return;
    }

    this.c_init(ctx,canvas.width,canvas.height);
    this.drawGrid(ctx,canvas.width,canvas.height);
    window.requestAnimationFrame(function(ts){
      this.anim_step(ctx,ts);
    }.bind(this));
  }

  /**
   * Initializes `this.pos` and `this.pos_r`, sets line color to `--brand-normal`
   * and moves the draw-cursor to the origin.
   * 
   * @param ctx - Canvas context.
   * @param c_x - Canvas width.
   * @param c_y - Canvas height.
   * @param x_off - Optional chart offset on 0x.
   * @param y_off - Optional chart offset on 0y.
   */
  private c_init(ctx: CanvasRenderingContext2D, c_x: number, c_y: number, x_off: number=0, y_off: number=0): void {
    this.pos.x = 0;
    this.pos.y = 0;
    this.pos_r.x = 0.5+x_off;
    this.pos_r.y = c_y-y_off;
    let color = getComputedStyle(document.querySelector('body')).getPropertyValue('--brand-normal');
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.pos_r.x, this.pos_r.y);
  }

  /**
   * Draw the chart's background grid.
   * 
   * @param ctx - Canvas context.
   * @param canvas_w - Canvas width.
   * @param canvas_h - Canvas height.
   */
  private drawGrid(ctx: CanvasRenderingContext2D, canvas_w: number, canvas_h: number): void {
    ctx.closePath();
    ctx.save();

    ctx.lineWidth = 1;
    ctx.strokeStyle = getComputedStyle(document.querySelector('body')).getPropertyValue('--gray-2');
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

  /**
   * Draw line on `ctx` starting from the current position.
   * 
   * @param ctx - Canvas context.
   * @param x - draw to here.
   * @param y - draw to here.
   */
  private line(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    this.pos.x += x;
    this.pos.y += y;
    this.pos_r.x += x;
    this.pos_r.y -= y;
    ctx.lineTo(this.pos_r.x, this.pos_r.y);
  }

  /**
   * Draw an arc on `ctx` on (x,y) with radius r.
   * 
   * @param ctx - Canvas context
   * @param x
   * @param y 
   * @param r - Radius.
   */
  private arc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.arc(this.pos_r.x,this.pos_r.y,r,0,2*Math.PI);
    ctx.moveTo(this.pos_r.x,this.pos_r.y);
  }

  /**
   * Setup the canvas for the correct DPI.
   * 
   * @param canvas - Canvas HTML element.
   * @returns Canvas context.
   */
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

  /**
   * Perform the actions of a step in the animation. It calculates the data point to be drawn,
   * also drawing any missing data points.
   * 
   * Has a maximum duration of `this.max_duration`, in ms.
   * 
   * @param ctx - Canvas context
   * @param ts - Current timestamp.
   */
  private anim_step(ctx: CanvasRenderingContext2D, ts: number): void {
    if (!this.start) this.start = ts;
    let dx = ts - this.start;
    let pos = Math.floor((dx*this.data.x.length)/this.max_duration); // element to be drawn at each `dx`
    this.anim_draw(ctx, pos);
    // Animation end
    if (dx < this.max_duration) {
      window.requestAnimationFrame(function(ts){
        this.anim_step(ctx,ts);
      }.bind(this));
    }
  }

  /**
   * Function that effectively draws each line and circle in the canvas.
   * 
   * `this.data` is being traversed but it's nearly impossible to have
   * only one element at each timestamp, usually they are skipped.
   * Eg: On one instant, this.data[4] is drawn, but on the next one
   * it's time for this.data[10], the remaining points are missing, so
   * they must be accounted for. That is why `this.prev_i` exists, to store
   * the previous `i`. In the example, "I'm on 10, previous is 4, I need to
   * draw everything from 5 to 10".
   * 
   * @param ctx - Canvas context.
   * @param i - Index of `this.data`.
   */
  private anim_draw(ctx: CanvasRenderingContext2D, i: number): void {
    for(;this.prev_i<i;this.prev_i++){
      let x = this.data.x[this.prev_i];
      let y = this.data.y[this.prev_i];
      let d_x = (x*this.x_scale)-this.pos.x;
      let d_y = (y*this.y_scale)-y-this.pos.y;
      this.line(ctx,d_x,d_y);
      this.arc(ctx,d_x,d_y,2);
      ctx.stroke();
    }
    this.prev_i = i;
  }

}
