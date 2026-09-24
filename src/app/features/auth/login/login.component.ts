import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AuthService } from '../services/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalTitleComponent } from "../../../shared/components/modal-title/modal-title.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalTitleComponent],
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

  onSubmit() {
    const req: LoginRequestDto = {
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
          this.toastService.show("Success", `Welcome back ${res.user.username}!`);
          this.activeModal.close();
        },
        error: (err) => this.toastService.show("Error", "The provided credentials are invalid.")
      });
  }

  get email() { return this.loginForm.get("email") }
  get password() { return this.loginForm.get("password") }

}
