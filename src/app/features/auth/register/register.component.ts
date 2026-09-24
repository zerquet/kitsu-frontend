import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterRequestDto } from '../dtos/register-request.dto';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppToastService } from '../../../shared/services/app-toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public activeModal = inject(NgbActiveModal);
  private authService = inject(AuthService);
  private toastService = inject(AppToastService);
  private destroyRef = inject(DestroyRef);
  
  registerForm = new FormGroup({
    username: new FormControl<any>('', Validators.required),
    email: new FormControl<any>('', Validators.required),
    password: new FormControl<any>('', Validators.required)
  });

  onSubmit() {
    const req: RegisterRequestDto = {
      username: this.username?.value,
      email: this.email?.value,
      password: this.password?.value
    }

    this.authService.register(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res.userId) {
            return;
          }
          this.toastService.show("Success", `Hello ${res.username}!`);
          this.activeModal.close();
        },
        error: (res) => { this.toastService.show("Error", res.error.error) }
      })
  }

  get username() { return this.registerForm.get("username") }
  get email() { return this.registerForm.get("email") }
  get password() { return this.registerForm.get("password") }
}
