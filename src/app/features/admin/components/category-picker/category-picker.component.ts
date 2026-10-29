import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Category } from '../../../../shared/models/category.model';

// Filterable chip list that binds a form control to an array of category ids
@Component({
  selector: 'admin-category-picker',
  standalone: true,
  templateUrl: './category-picker.component.html',
  styleUrl: './category-picker.component.css',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CategoryPickerComponent), multi: true }]
})
export class CategoryPickerComponent implements ControlValueAccessor {
  @Input() categories: Category[] = [];
  selectedIds = new Set<number>();
  filterTerm = '';
  disabled = false;
  private onChange: (value: number[]) => void = () => { };
  private onTouched: () => void = () => { };

  get visibleCategories() {
    const term = this.filterTerm.trim().toLowerCase();
    return term.length === 0
      ? this.categories
      : this.categories.filter(c => c.name?.toLowerCase().includes(term));
  }

  onFilterInput(event: Event) {
    this.filterTerm = (event.target as HTMLInputElement).value;
  }

  toggle(id: number) {
    if (this.disabled) return;
    const next = new Set(this.selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.selectedIds = next;
    this.onChange([...next]);
    this.onTouched();
  }

  writeValue(value: number[] | null): void {
    this.selectedIds = new Set(value ?? []);
  }

  registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
