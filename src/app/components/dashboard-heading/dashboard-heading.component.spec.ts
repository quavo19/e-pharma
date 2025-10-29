import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHeadingComponent } from './dashboard-heading.component';

describe('DashboardHeadingComponent', () => {
  let component: DashboardHeadingComponent;
  let fixture: ComponentFixture<DashboardHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
