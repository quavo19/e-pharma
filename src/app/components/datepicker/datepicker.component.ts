import {
  Component,
  input,
  output,
  forwardRef,
  signal,
  computed,
  effect,
  HostListener,
  ElementRef,
  inject,
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

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

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
  private elementRef = inject(ElementRef);

  placeholder = input('Select date');
  disabled = input(false);
  rangeMode = input(false);
  dateChange = output<Date | null | DateRange>();

  public readonly icons = { Calendar, ChevronLeft, ChevronRight, ChevronDown };

  isOpen = signal(false);
  selectedDate = signal<Date | null>(null);
  selectedRange = signal<DateRange>({ start: null, end: null });
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
  days = signal<(number | null)[]>([]);
  firstDayOfMonth = signal(0);
  daysInMonth = signal(0);

  private onChange = (value: Date | null | DateRange) => {};
  private onTouched = () => {};

  constructor() {
    this.generateYears();
    this.updateCalendar();
  }

  writeValue(value: Date | null | DateRange): void {
    if (this.rangeMode()) {
      if (value && typeof value === 'object' && 'start' in value) {
        this.selectedRange.set(value as DateRange);
        if (value.start) {
          this.currentYear.set(value.start.getFullYear());
          this.currentMonth.set(value.start.getMonth());
        }
      } else {
        this.selectedRange.set({ start: null, end: null });
      }
    } else {
      this.selectedDate.set(value as Date | null);
      if (value && !('start' in value)) {
        this.currentYear.set((value as Date).getFullYear());
        this.currentMonth.set((value as Date).getMonth());
      }
    }
    this.updateCalendar();
  }

  registerOnChange(fn: (value: Date | null | DateRange) => void): void {
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
    // Fix: getDay() returns 0-6 (Sun-Sat), but we want 0-6 (Mon-Sun)
    const dayOfWeek = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
    this.firstDayOfMonth.set(dayOfWeek);

    const daysInMonth = new Date(
      this.currentYear(),
      this.currentMonth() + 1,
      0
    ).getDate();
    this.daysInMonth.set(daysInMonth);

    const daysArray: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < dayOfWeek; i++) {
      daysArray.push(null);
    }

    // Add days of the month
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

  selectDate(day: number | null): void {
    if (day === null) return;

    const selectedDate = new Date(this.currentYear(), this.currentMonth(), day);

    if (this.rangeMode()) {
      const currentRange = this.selectedRange();
      let newRange: DateRange;

      if (!currentRange.start || (currentRange.start && currentRange.end)) {
        // Start new range
        newRange = { start: selectedDate, end: null };
      } else {
        // Complete the range
        if (selectedDate < currentRange.start) {
          newRange = { start: selectedDate, end: currentRange.start };
        } else {
          newRange = { start: currentRange.start, end: selectedDate };
        }
      }

      this.selectedRange.set(newRange);
      this.onChange(newRange);
      this.dateChange.emit(newRange);
    } else {
      this.selectedDate.set(selectedDate);
      this.onChange(selectedDate);
      this.dateChange.emit(selectedDate);
    }
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

  isSelectedDate(day: number | null): boolean {
    if (day === null) return false;

    if (this.rangeMode()) {
      const range = this.selectedRange();
      if (!range.start) return false;

      const dayDate = new Date(this.currentYear(), this.currentMonth(), day);

      // Check if it's the start date
      if (range.start.getTime() === dayDate.getTime()) return true;

      // Check if it's the end date
      if (range.end && range.end.getTime() === dayDate.getTime()) return true;

      // Check if it's within the range
      if (range.end && dayDate > range.start && dayDate < range.end)
        return true;

      return false;
    } else {
      const selected = this.selectedDate();
      if (!selected) return false;
      return (
        selected.getDate() === day &&
        selected.getMonth() === this.currentMonth() &&
        selected.getFullYear() === this.currentYear()
      );
    }
  }

  isToday(day: number | null): boolean {
    if (day === null) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === this.currentMonth() &&
      today.getFullYear() === this.currentYear()
    );
  }

  getDisplayValue(): string {
    if (this.rangeMode()) {
      const range = this.selectedRange();
      if (!range.start) return this.placeholder();
      if (!range.end) return range.start.toLocaleDateString();
      return `${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`;
    } else {
      const selected = this.selectedDate();
      if (!selected) return this.placeholder();
      return selected.toLocaleDateString();
    }
  }

  closeCalendar(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.isOpen() &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.closeCalendar();
    }
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
