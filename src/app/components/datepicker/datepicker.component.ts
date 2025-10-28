import {
  Component,
  input,
  output,
  forwardRef,
  signal,
  computed,
  effect,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-angular';

@Component({
  selector: 'app-datepicker',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './datepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  placeholder = input('Select date');
  disabled = input(false);
  dateChange = output<Date | null>();

  public readonly icons = { Calendar, ChevronLeft, ChevronRight, ChevronDown };

  isOpen = signal(false);
  selectedDate = signal<Date | null>(null);
  currentDate = signal(new Date());
  currentYear = signal(new Date().getFullYear());
  currentMonth = signal(new Date().getMonth());
  showYearDropdown = signal(false);
  showMonthDropdown = signal(false);

  years = signal<number[]>([]);
  months = signal([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]);
  days = signal<number[]>([]);
  firstDayOfMonth = signal(0);
  daysInMonth = signal(0);

  private onChange = (value: Date | null) => {};
  private onTouched = () => {};

  constructor() {
    this.generateYears();
    this.updateCalendar();
  }

  writeValue(value: Date | null): void {
    this.selectedDate.set(value);
    if (value) {
      this.currentYear.set(value.getFullYear());
      this.currentMonth.set(value.getMonth());
      this.updateCalendar();
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Note: This is handled by the input signal now
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    const yearsArray: number[] = [];
    for (let i = currentYear - 100; i <= currentYear + 10; i++) {
      yearsArray.push(i);
    }
    this.years.set(yearsArray);
  }

  updateCalendar(): void {
    const date = new Date(this.currentYear(), this.currentMonth(), 1);
    this.firstDayOfMonth.set(date.getDay());
    const daysInMonth = new Date(
      this.currentYear(),
      this.currentMonth() + 1,
      0
    ).getDate();
    this.daysInMonth.set(daysInMonth);

    const daysArray: number[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    this.days.set(daysArray);
  }

  toggleCalendar(): void {
    if (!this.disabled()) {
      this.isOpen.set(!this.isOpen());
      this.onTouched();
    }
  }

  selectDate(day: number): void {
    const selectedDate = new Date(this.currentYear(), this.currentMonth(), day);
    this.selectedDate.set(selectedDate);
    this.onChange(selectedDate);
    this.dateChange.emit(selectedDate);
    this.isOpen.set(false);
  }

  selectYear(year: number): void {
    this.currentYear.set(year);
    this.updateCalendar();
    this.showYearDropdown.set(false);
  }

  selectMonth(month: number): void {
    this.currentMonth.set(month);
    this.updateCalendar();
    this.showMonthDropdown.set(false);
  }

  navigateMonth(direction: 'prev' | 'next'): void {
    if (direction === 'prev') {
      if (this.currentMonth() === 0) {
        this.currentMonth.set(11);
        this.currentYear.set(this.currentYear() - 1);
      } else {
        this.currentMonth.set(this.currentMonth() - 1);
      }
    } else {
      if (this.currentMonth() === 11) {
        this.currentMonth.set(0);
        this.currentYear.set(this.currentYear() + 1);
      } else {
        this.currentMonth.set(this.currentMonth() + 1);
      }
    }
    this.updateCalendar();
  }

  isSelectedDate(day: number): boolean {
    const selected = this.selectedDate();
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === this.currentMonth() &&
      selected.getFullYear() === this.currentYear()
    );
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === this.currentMonth() &&
      today.getFullYear() === this.currentYear()
    );
  }

  getDisplayValue(): string {
    const selected = this.selectedDate();
    if (!selected) return this.placeholder();
    return selected.toLocaleDateString();
  }

  closeCalendar(): void {
    this.isOpen.set(false);
  }

  toggleYearDropdown(): void {
    this.showYearDropdown.set(!this.showYearDropdown());
    this.showMonthDropdown.set(false);
  }

  toggleMonthDropdown(): void {
    this.showMonthDropdown.set(!this.showMonthDropdown());
    this.showYearDropdown.set(false);
  }
}
