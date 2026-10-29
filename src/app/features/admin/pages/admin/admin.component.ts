import { Component } from '@angular/core';
import { AsideComponent } from "../../components/aside/aside.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AsideComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent { }
