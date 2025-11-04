import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InlineDateInputComponent } from './inline-date-input.component';

describe('InlineDateInputComponent', () => {
  let component: InlineDateInputComponent;
  let fixture: ComponentFixture<InlineDateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineDateInputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InlineDateInputComponent);
    fixture.componentRef.setInput('control', new FormControl());
    fixture.componentRef.setInput('id', 'test-date-input');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
