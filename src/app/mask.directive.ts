import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Directive, Input, HostListener, Renderer2, ElementRef, forwardRef } from '@angular/core';



@Directive({
  selector: '[appMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true
    },
  ],
})
export class MaskDirective implements ControlValueAccessor {

  isUserDeletingValue = false;
  cursorPosition: number;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
  ) { }

  @Input() appMask: string;



  @HostListener('keydown', ['$event'])
  onKeydown($event) {
    if (this.onDeleteOrBackSpacePressed($event)) {
      const el = ($event.target as HTMLInputElement);
      const cursorPosition = el.selectionStart;


      console.log('delete: ', cursorPosition);


      this.isUserDeletingValue = true;
    }
  }

  @HostListener('input', ['$event'])
  onInput($event) {

    const [mask, maskReplacedPattern, maskSplited] = this.setStringMaskValues(this.appMask);
    const [inputValue, inputValueReplacedPattern, inputValueSplited] = this.setStringMaskValues($event.target.value);

    const el: HTMLInputElement = ($event.target as HTMLInputElement);
    const cursorPosition: number = el.selectionStart;

    // console.log(el, cursorPosition);


    let inputValueSplitedValue;

    if (this.onArrowsPressed($event)) {
      return;
    }

    if (this.isUserDeletingValue) {
      inputValueSplitedValue = this.resetInputOnDeleting(inputValueSplited, maskSplited);
      console.log(el.selectionStart, el.selectionEnd)
    } else {
      this.isUserDeletingValue = false;
      inputValueSplitedValue = inputValueSplited;
    }

    if (this.inpuValueHasGreaterSizeThenMask(inputValueReplacedPattern, maskReplacedPattern)) {
      el.value = this.removeLastNumber($event.target.value);
      return;
    }



    el.value = this.apllyInputMaskValue(inputValueSplitedValue, maskSplited, mask);
    if (this.isUserDeletingValue) {
      this.isUserDeletingValue = false;
      el.selectionStart = el.selectionEnd = cursorPosition;
    }

  }


  apllyInputMaskValue(inputValueSplitedValue, maskSplited, mask) {
    let indexOnMask = 0;
    const returValue = inputValueSplitedValue.map((inputGroup, index) => {
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
      return this.removeLastNumber(returValue);
    }

    return returValue;

  }

  @HostListener('blur', ['$event'])
  onBlur($event) {
    const inputValue = $event.target.value;
    if (inputValue) {
    }

  }



  writeValue(value: any): void {
    console.log(value);
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



}
