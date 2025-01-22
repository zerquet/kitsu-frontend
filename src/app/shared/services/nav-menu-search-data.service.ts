import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavMenuSearchDataService {
  show$ = new BehaviorSubject<boolean>(false);
  term$ = new BehaviorSubject<string>("");
  constructor() { }
}
