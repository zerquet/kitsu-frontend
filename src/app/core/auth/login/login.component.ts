import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { AuthService } from '../services/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginDto } from '../loginDto.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //https://ng-bootstrap.github.io/#/components/modal/examples#component
  form: FormGroup;
  errMsg = "";
  constructor(public activeModal: NgbActiveModal, private authService: AuthService, private toastService: AppToastService) {
    this.name = "";
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  @Input() name: string;

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  onSubmit() {
    const loginDto: LoginDto = {
      email: this.email?.value,
      password: this.password?.value
    };
    
    this.authService.login(loginDto).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        this.authService.setUser(res);
        this.toastService.show("Success", `Welcome back ${res.username}!`);
        this.activeModal.close();
        //reload page?
      },
      error: (err) => this.errMsg = err.error
    });
  }
}
