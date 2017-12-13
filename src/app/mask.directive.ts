import { Directive, Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ValueTransformer } from '@angular/compiler/src/util';
import { findLast } from '@angular/compiler/src/directive_resolver';

@Directive({
  selector: '[appMask]'
})
export class MaskDirective implements ControlValueAccessor {

  isUserDeletingValue = false;


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


  onDeleteOrBackSpacePressed($event) {
    if ($event.keyCode === 8 || $event.keyCode === 46) {
      return true;
    }
  }

  onArrowsPressed($event) {
    if ($event.keyCode === 37 || $event.keyCode === 38 || $event.keyCode === 39 || $event.keyCode === 40) {
      return true;
    }
  }


  printValues(mask,
    maskSplited,
    maskReplacedPattern,
    inputValue,
    inputValueSplited,
    inputValueReplacedPattern) {

    console.log('mask: ', mask);
    console.log('maskSplited: ', maskSplited);
    console.log('maskReplacedPattern: ', maskReplacedPattern);
    console.log('inputValue: ', inputValue);
    console.log('inputValueSplited: ', inputValueSplited);
    console.log('inputValueReplacedPattern: ', inputValueReplacedPattern);
  }


  setStringMaskValues(value) {
    return [
      value,
      value.replace(/\D/g, '_'),
      value.split(/\D/g).filter(v => v),
    ];
  }


  exchangeValuesForwardToBack(inputValueSplited, maskSplited, actualGroup, index, arr) {
    const nextGroup: string = inputValueSplited[index + 1];
    if (nextGroup) {
      while (maskSplited[index].length > actualGroup.length) {
        actualGroup += arr[index + 1].charAt(0);
        arr[index + 1] = arr[index + 1].substr(1);
      }
    }
    return actualGroup;
  }

  resetInputOnDeleting(inputValueSplited, maskSplited) {
    return inputValueSplited.map((actualGroup, index, arr) => {
      return this.exchangeValuesForwardToBack(inputValueSplited, maskSplited, actualGroup, index, arr);
    });
  }


  /*   resetInputOnDeleting(inputValueSplited, maskSplited) {
      return inputValueSplited.map((actualGroup, index, arr) => {
        const nextGroup: string = inputValueSplited[index + 1];
        if (nextGroup) {
          while (maskSplited[index].length > actualGroup.length) {
            actualGroup += arr[index + 1].charAt(0);
            arr[index + 1] = arr[index + 1].substr(1);
          }
        }
        return actualGroup;
      });
    }
   */

  inpuValueHasGreaterSizeThenMask(data1, data2) {
    return data1.length > data2.length;
  }

  removeLastNumber(value) {
    return value.substr(0, value.length - 1);
  }

  lastValueOf(value, asString?) {
    const lastIndex = value.length - 1;
    return asString ? value.charAt(lastIndex) : parseFloat(value.charAt(lastIndex));
  }


  asArrayNumbers(maskValue) {
    return maskValue.split('').map(v => parseFloat(v));
  }

  isActualInputGreaterThenMaskInput(inputGroup, maskValue) {
    const actualIndex = inputGroup.length - 1;
    return this.lastValueOf(inputGroup) > this.asArrayNumbers(maskValue)[actualIndex];
  }


  hasSameSize(inputGroup, maskSplited) {
    return inputGroup.length === maskSplited.length;
  }


  isNotANumber(value) {
    return /\D/.test(this.lastValueOf(value, true));
  }

  isGreaterThen(value1, value2) {
    return parseFloat(value1) > parseFloat(value2);
  }


  parseInputToMaskPattern() {

  }

  @HostListener('keydown', ['$event'])
  onKeyup($event) {
    if (this.onDeleteOrBackSpacePressed($event)) {
      this.isUserDeletingValue = true;
    }
  }

  @HostListener('input', ['$event'])
  onInput($event) {

    const el: HTMLInputElement = ($event.target as HTMLInputElement);
    const position: number = el.selectionStart;

    console.log(el, position);

    const [mask, maskReplacedPattern, maskSplited] = this.setStringMaskValues(this.appMask);
    const [inputValue, inputValueReplacedPattern, inputValueSplited] = this.setStringMaskValues($event.target.value);

    let inputValueSplitedValue;
    let returValue;

    if (this.onArrowsPressed($event)) {
      this.registerOnChange(inputValue);
      return;
    }

    if (this.isUserDeletingValue) {
      inputValueSplitedValue = this.resetInputOnDeleting(inputValueSplited, maskSplited);
    } else {
      this.isUserDeletingValue = false;
      inputValueSplitedValue = inputValueSplited;
    }

    if (this.inpuValueHasGreaterSizeThenMask(inputValueReplacedPattern, maskReplacedPattern)) {
      $event.target.value = this.removeLastNumber($event.target.value);
      this.registerOnChange(inputValue);
      return;
    }

    let indexOnMask = 0;

    returValue = inputValueSplitedValue.map((inputGroup, index) => {
      indexOnMask += inputGroup.length;
      if (this.hasSameSize(inputGroup, maskSplited[index])) {
        inputGroup += mask.charAt(indexOnMask);
        indexOnMask++;

      } else if (this.isGreaterThen(inputGroup.length, maskSplited[index].length)) {
        indexOnMask--;
        const lastIndex = inputGroup.length - 1;
        const lastValue = inputGroup.charAt(lastIndex);
        inputGroup = inputGroup.substr(0, inputGroup.length - 1);

        inputGroup += mask.charAt(indexOnMask);
        inputGroup += lastValue;
      } else if (this.isGreaterThen(inputGroup, maskSplited[index])) {
        inputGroup = this.removeLastNumber(inputGroup);
      }

      if (this.isActualInputGreaterThenMaskInput(inputGroup, maskSplited[index])) {
        inputGroup = this.removeLastNumber(inputGroup);
      }

      return inputGroup;
    }).join('');

    if (this.isUserDeletingValue && this.isNotANumber(this.lastValueOf(returValue, true))) {
      returValue = this.removeLastNumber(returValue);
    }

    $event.target.value = returValue;
  }

  @HostListener('blur', ['$event'])
  onBlur($event) {
    const inputValue = $event.target.value;
    if (inputValue) {
    }

  }


}
