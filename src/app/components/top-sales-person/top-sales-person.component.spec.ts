import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSalesPersonComponent } from './top-sales-person.component';

describe('TopSalesPersonComponent', () => {
  let component: TopSalesPersonComponent;
  let fixture: ComponentFixture<TopSalesPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSalesPersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopSalesPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
