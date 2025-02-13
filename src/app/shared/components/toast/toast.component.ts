import { Component } from '@angular/core';
import { AppToastService } from '../../services/app-toast.service';
import { NgClass } from '@angular/common';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'toast',
  standalone: true,
  imports: [NgbToast, NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  constructor(public toastService: AppToastService) {}

}
