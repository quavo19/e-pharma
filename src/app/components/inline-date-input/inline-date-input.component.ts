import {
  Component,
  input,
  output,
  signal,
  HostListener,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inline-date-input',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  standalone: true,
  templateUrl: './inline-date-input.component.html',
})
export class InlineDateInputComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private valueSubscription?: Subscription;

  public readonly label = input<string>();
  public readonly placeholder = input<string>('Select date');
  public readonly control = input.required<FormControl>();
  public readonly errorMessage = input<string>('');
  public readonly required = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly id = input.required<string>();
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly className = input<string>('');

  public readonly dateChange = output<Date | null>();
  public readonly inputBlur = output<FocusEvent>();

  public readonly icons = { Calendar, ChevronDown, ChevronLeft, ChevronRight };

  isOpen = signal(false);
  showYearDropdown = signal(false);
  showMonthDropdown = signal(false);
  currentYear = signal(new Date().getFullYear());
  currentMonth = signal(new Date().getMonth());
  selectedDate = signal<Date | null>(null);

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

  displayText = computed(() => {
    const date = this.selectedDate();
    if (!date) return this.placeholder();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  private onCaptureClick = (event: Event) => {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.isOpen() && !this.elementRef.nativeElement.contains(target)) {
      this.closeCalendar();
    }
  };

  ngOnInit(): void {
    this.generateYears();
    this.updateCalendar();
    this.syncWithFormControl();

    // Listen to form control changes
    this.valueSubscription = this.control().valueChanges.subscribe((value) => {
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          this.selectedDate.set(date);
          this.currentYear.set(date.getFullYear());
          this.currentMonth.set(date.getMonth());
          this.updateCalendar();
        }
      } else {
        this.selectedDate.set(null);
      }
    });

    document.addEventListener('click', this.onCaptureClick, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onCaptureClick, true);
    if (this.valueSubscription) {
      this.valueSubscription.unsubscribe();
    }
  }

  syncWithFormControl(): void {
    const value = this.control().value;
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        this.selectedDate.set(date);
        this.currentYear.set(date.getFullYear());
        this.currentMonth.set(date.getMonth());
        this.updateCalendar();
      }
    }
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
    const dayOfWeek = (date.getDay() + 6) % 7;
    const daysInMonth = new Date(
      this.currentYear(),
      this.currentMonth() + 1,
      0
    ).getDate();

    const daysArray: (number | null)[] = [];
    for (let i = 0; i < dayOfWeek; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    this.days.set(daysArray);
  }

  toggleCalendar(): void {
    if (!this.disabled()) {
      this.isOpen.set(!this.isOpen());
    }
  }

  selectDate(day: number | null): void {
    if (day === null) return;

    const selectedDate = new Date(this.currentYear(), this.currentMonth(), day);
    this.selectedDate.set(selectedDate);

    // Format as YYYY-MM-DD for form control
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;

    this.control().setValue(formattedDate);
    this.control().markAsTouched();
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

  isSelectedDate(day: number | null): boolean {
    if (day === null) return false;
    const selected = this.selectedDate();
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === this.currentMonth() &&
      selected.getFullYear() === this.currentYear()
    );
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

  closeCalendar(): void {
    this.isOpen.set(false);
    this.showYearDropdown.set(false);
    this.showMonthDropdown.set(false);
  }

  toggleYearDropdown(): void {
    this.showYearDropdown.set(!this.showYearDropdown());
    this.showMonthDropdown.set(false);
  }

  toggleMonthDropdown(): void {
    this.showMonthDropdown.set(!this.showMonthDropdown());
    this.showYearDropdown.set(false);
  }

  get buttonClasses(): string {
    const baseClasses =
      'flex items-center gap-3 rounded-xl font-light border transition-all duration-200 w-full';
    const disabledClasses = this.disabled()
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
      : this.errorMessage()
      ? 'text-gray-700 border-red-400 hover:border-red-500'
      : 'text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm h-10',
      md: 'px-3 py-0 text-base h-12',
      lg: 'px-4 py-0 text-lg h-14',
    };

    return `${baseClasses} ${disabledClasses} ${sizeClasses[this.size()]}`;
  }

  get dropdownClasses(): string {
    return `absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-full min-w-80`;
  }
}
