import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'advanced-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.css'
})
export class AdvancedSearchComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  @Output() formChange = new EventEmitter<string>();
  form = new FormGroup({ search: new FormControl('') });

  ngOnInit(): void {
    this.form.controls['search'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef))
    .subscribe(term => this.formChange.emit(term?.toLocaleLowerCase()));  
  }
  
}
