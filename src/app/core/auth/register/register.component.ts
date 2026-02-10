import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public activeModal = inject(NgbActiveModal);
  
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  get username() { return this.registerForm.get("username") }
  get email() { return this.registerForm.get("email") }
  get password() { return this.registerForm.get("password") }

  onRegisterFormSubmit() {
    this.activeModal.close();
  }
}
