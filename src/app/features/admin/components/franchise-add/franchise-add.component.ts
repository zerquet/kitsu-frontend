import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Franchise } from '../../../../shared/models/franchise.model';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { FranchiseService } from '../../../../shared/services/franchise.service';
import { TrimDirective } from '../../../../core/directives/trim.directive';

@Component({
  selector: 'app-franchise-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TrimDirective],
  templateUrl: './franchise-add.component.html',
  styleUrl: '../../admin-shared.css'
})
export class FranchiseAddComponent {
  private franchiseService = inject(FranchiseService);
  private toastService = inject(AppToastService);
  private router = inject(Router);
  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (!this.name || !this.name.value) return;
    const req = this.name?.value;

    this.franchiseService.addFranchise(req).subscribe({
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
