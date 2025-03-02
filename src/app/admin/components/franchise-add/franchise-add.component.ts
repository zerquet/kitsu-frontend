import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Franchise } from '../../../shared/models/franchise.model';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { FranchiseService } from '../../../shared/services/franchise.service';
import { NgIf } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-franchise-add',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FloatLabelModule, InputTextModule],
  templateUrl: './franchise-add.component.html',
  styleUrl: './franchise-add.component.css'
})
export class FranchiseAddComponent {
  private franchiseService = inject(FranchiseService);
  private toastService = inject(AppToastService);
  private router = inject(Router);
  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  onSubmit() {
    const data: Franchise = { name: this.name?.value }

    this.franchiseService.addFranchise(data).subscribe({
      next: () => {
        this.toastService.show('Success', `Franchise '${this.name?.value}' added successfully`);
        this.form.reset();
        this.router.navigate(['/admin/franchises']);
      },
      error: () => {
        this.toastService.show('Error', 'Failed to add franchise');
      }
    });
  }

  //FORM GETTERS
  get name() { return this.form.get('name'); }
}
