import { Directive, Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ValueTransformer } from '@angular/compiler/src/util';

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


  keyPressedIsNotIputableKey($event, inputValue) {
    if ($event.keyCode === 8 || $event.keyCode === 37 || $event.keyCode === 38 || $event.keyCode === 39 || $event.keyCode === 40 || $event.keyCode === 46) {
      this.registerOnChange(inputValue);
      return true;
    }
  }


  setStringMaskValues(value) {
    return [
      value,
      value.replace(/\D/g, '_'),
      value.split(/\D/g),
    ];
  }

  isStringGreater(inputValueReplacedPattern, maskReplacedPattern) {
    console.log(maskReplacedPattern);
    return inputValueReplacedPattern.length > maskReplacedPattern.length;
  }

  withLastCharRemove(value) {
    return value.substr(0, value.length - 1);
  }

  lastValueOf(value) {
    const lastIndex = value.length - 1;
    return value.charAt(lastIndex);
  }

  @HostListener('keyup', ['$event'])
  onInput($event) {

    const [mask, maskReplacedPattern, maskSplited] = this.setStringMaskValues(this.appMask);
    const [inputValue, inputValueReplacedPattern, inputValueSplited] = this.setStringMaskValues($event.target.value);

    console.log('mask: ', mask);
    console.log('maskSplited: ', maskSplited);
    console.log('maskReplacedPattern: ', maskReplacedPattern);
    console.log('inputValue: ', inputValue);
    console.log('inputValueSplited: ', inputValueSplited);
    console.log('inputValueReplacedPattern: ', inputValueReplacedPattern);

    /* retuonos */
    if (this.keyPressedIsNotIputableKey($event, inputValue)) {
      return;
    }

    if (this.isStringGreater(inputValueReplacedPattern, maskReplacedPattern)) {
      $event.target.value = this.withLastCharRemove($event.target.value);
      this.registerOnChange(inputValue);
      return;
    }


    let indexOnMask = 0;
    const inputJoined = inputValueSplited.map((value, index) => {

      indexOnMask += value.length;

      if (value.length === maskSplited[index].length && parseFloat(value) <= parseFloat(maskSplited[index])) {
        value += mask.charAt(indexOnMask);
        indexOnMask++;

        //  && 
      } else if (value.length > maskSplited[index].length) {
        indexOnMask--;
        const lastIndex = value.length - 1;
        const lastValue = value.charAt(lastIndex);
        value = value.substr(0, value.length - 1);

        value += mask.charAt(indexOnMask);
        value += lastValue;
      } else if (parseFloat(value) > parseFloat(maskSplited[index])) {
        value = this.withLastCharRemove(value);
      }

      return value;
    }).join('');

    $event.target.value = inputJoined;
  }




  @HostListener('blur', ['$event'])
  onBlur($event) {
    const inputValue = $event.target.value;
    if (inputValue) {
      console.log(inputValue);
    }

  }

}
