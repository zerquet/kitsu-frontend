import { inject, Injectable, Type } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class TypedModalService {
  private modalService = inject(NgbModal);

  constructor() { }

  //Solves loosely typed issue and catches mistakes at compile time. Inputs must exist in type T.
  open<T>(
    component: Type<T>, 
    input: Partial<T>,
    options?: NgbModalOptions
  ): NgbModalRef {
    const modalInstance = this.modalService.open(component, options);
    Object.assign(modalInstance.componentInstance, input)
    return modalInstance;
  }
}
