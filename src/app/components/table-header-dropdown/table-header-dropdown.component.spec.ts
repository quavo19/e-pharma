import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderDropdownComponent } from './table-header-dropdown.component';

describe('TableHeaderDropdownComponent', () => {
  let component: TableHeaderDropdownComponent;
  let fixture: ComponentFixture<TableHeaderDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeaderDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableHeaderDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
