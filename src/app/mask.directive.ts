import { Directive } from '@angular/core';
import { HostListener } from '@angular/core';

@Directive({
  selector: '[appMask]'
})
export class MaskDirective {

  constructor() { }


  @HostListener('blur', ['$event'])
  onBlur($event) {
    const inputValue = $event.target.value;
    if ($event.target.value) {
      console.log($event.target.value);
    }
  }

}
