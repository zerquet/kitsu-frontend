import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AuthService } from '../services/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginRequest } from '../loginRequest.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public activeModal = inject(NgbActiveModal);
  private authService = inject(AuthService);
  private toastService = inject(AppToastService);
  private destroyRef = inject(DestroyRef);

  //https://ng-bootstrap.github.io/#/components/modal/examples#component
  loginForm = new FormGroup({
    email: new FormControl<any>('', Validators.required),
    password: new FormControl<any>('', Validators.required)
  });
  errMsg = "";

  get email() { return this.loginForm.get("email") }
  get password() { return this.loginForm.get("password") }

  onSubmit() {
    const req: LoginRequest = {
      email: this.email?.value,
      password: this.password?.value
    };

    this.authService.login(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res.user) {
            return;
          }
          this.toastService.show("Success", `Welcome back ${res.user.userName}!`);
          this.activeModal.close();
        },
        error: (err) => this.errMsg = err.error
      });
  }
}
