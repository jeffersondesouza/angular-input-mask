import { Directive, Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appMask]'
})
export class MaskDirective implements ControlValueAccessor {

  constructor() { }

  @Input() appMask: string;


  writeValue(value: any): void {
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  propagateChange = (_: any) => { };

  registerOnTouched(fn: any): void { }

  // ([0-9]{3}).([0-9]{3}).([0-9]{3})-([0-9]{2})


  notIputableKeysPressedReturn($event, inputValue) {
    if ($event.keyCode === 8 || $event.keyCode === 37 || $event.keyCode === 38 || $event.keyCode === 39 || $event.keyCode === 40 || $event.keyCode === 46) {
      this.registerOnChange(inputValue);
      return true;
    }
  }


  @HostListener('keyup', ['$event'])
  onInput($event) {



    const mask: string = this.appMask;
    const maskSplited = mask.split(/\D/g);
    const maskReplacedPattern = mask.replace(/\D/g, '_');

    const inputValue: string = $event.target.value;
    const inputValueSplited = inputValue.split(/\D/g);
    const inputValueReplacedPattern = inputValue.replace(/\D/g, '_');

    console.log('mask: ', mask);
    console.log('maskSplited: ', maskSplited);
    console.log('maskReplacedPattern: ', maskReplacedPattern);


    console.log('inputValue: ', inputValue);
    console.log('inputValueSplited: ', inputValueSplited);
    console.log('inputValueReplacedPattern: ', inputValueReplacedPattern);

    if (this.notIputableKeysPressedReturn($event, inputValue)) {
      return;
    }





    if (inputValue.length <= maskReplacedPattern.length) {
      this.registerOnChange(inputValue);
    }

    maskSplited.forEach((element, index) => {
    });
    $event.target.value = inputValue + '.';
  }




  @HostListener('blur', ['$event'])
  onBlur($event) {
    const inputValue = $event.target.value;
    if (inputValue) {
      console.log(inputValue);
    }

  }

}
