import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrim]',
  standalone: true
})
export class TrimDirective {
  constructor(private el: ElementRef, private ngControl: NgControl) {}

  @HostListener('blur')
  onBlur() {    
    if (this.ngControl.control) {
      const trimmedValue = this.el.nativeElement.value.trim();      
      this.ngControl.control.setValue(trimmedValue);
    }
  }
}
