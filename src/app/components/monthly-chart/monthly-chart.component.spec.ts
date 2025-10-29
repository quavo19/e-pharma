import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyChartComponent } from './monthly-chart.component';

describe('MonthlyChartComponent', () => {
  let component: MonthlyChartComponent;
  let fixture: ComponentFixture<MonthlyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate bar height correctly', () => {
    expect(component.getBarHeight(700)).toBe(50);
    expect(component.getBarHeight(1400)).toBe(100);
    expect(component.getBarHeight(0)).toBe(0);
  });

  it('should calculate remaining height correctly', () => {
    expect(component.getRemainingHeight(700)).toBe(50);
    expect(component.getRemainingHeight(1400)).toBe(0);
    expect(component.getRemainingHeight(0)).toBe(100);
  });

  it('should handle hover state correctly', () => {
    component.onMouseEnter('Jan');
    expect(component.hoveredMonth()).toBe('Jan');
    expect(component.isHovered('Jan')).toBe(true);
    expect(component.isHovered('Feb')).toBe(false);

    component.onMouseLeave();
    expect(component.hoveredMonth()).toBe(null);
    expect(component.isHovered('Jan')).toBe(false);
  });

  it('should return correct hovered data', () => {
    component.onMouseEnter('May');
    const hoveredData = component.getHoveredData();
    expect(hoveredData).toBeTruthy();
    expect(hoveredData?.month).toBe('May');
    expect(hoveredData?.value).toBe(750);
  });
});
