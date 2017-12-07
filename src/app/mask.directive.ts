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

  removeLastNumber(value) {
    return value.substr(0, value.length - 1);
  }

  lastValueOf(value) {
    const lastIndex = value.length - 1;
    return parseFloat(value.charAt(lastIndex));
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
      $event.target.value = this.removeLastNumber($event.target.value);
      this.registerOnChange(inputValue);
      return;
    }


    let indexOnMask = 0;
    const inputJoined = inputValueSplited.map((inputStringGroup, index) => {

      indexOnMask += inputStringGroup.length;


      if (this.lastValueOf(inputStringGroup) > maskSplited[index].split('').map(v => parseFloat(v))[inputStringGroup.length - 1]) {
        inputStringGroup = this.removeLastNumber(inputStringGroup);
      }

      if (inputStringGroup.length === maskSplited[index].length && parseFloat(inputStringGroup) <= parseFloat(maskSplited[index])) {
        inputStringGroup += mask.charAt(indexOnMask);
        indexOnMask++;
      } else if (inputStringGroup.length > maskSplited[index].length) {
        indexOnMask--;
        const lastIndex = inputStringGroup.length - 1;
        const lastValue = inputStringGroup.charAt(lastIndex);
        inputStringGroup = inputStringGroup.substr(0, inputStringGroup.length - 1);

        inputStringGroup += mask.charAt(indexOnMask);
        inputStringGroup += lastValue;
      } else if (parseFloat(inputStringGroup) > parseFloat(maskSplited[index])) {
        inputStringGroup = this.removeLastNumber(inputStringGroup);
      }



      return inputStringGroup;
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
