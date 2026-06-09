import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() formChange = new EventEmitter<string>();
  form = new FormGroup({ search: new FormControl('') });

  ngOnInit(): void {
    this.form.controls['search'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.destroy$))
    .subscribe(term => this.formChange.emit(term?.toLocaleLowerCase()));  
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();
  
}
