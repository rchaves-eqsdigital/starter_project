import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineEchartsComponent } from './line-echarts.component';

describe('LineEchartsComponent', () => {
  let component: LineEchartsComponent;
  let fixture: ComponentFixture<LineEchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineEchartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineEchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
