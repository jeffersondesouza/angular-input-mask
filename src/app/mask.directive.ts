
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Directive, Input, OnInit, HostListener, Renderer2, ElementRef, forwardRef } from '@angular/core';



@Directive({
  selector: '[appMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true
    }
  ]
})
export class MaskDirective implements OnInit, ControlValueAccessor {

  isUserDeletingValue = false;
  elementValue;
  cursorPosition: number;


  @Input() appMask: string;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
  ) { }

  public ngOnInit(): void {
    this.elementValue = this._elementRef.nativeElement.value;
  }

  writeValue(value: any) {
    if (value !== undefined) {
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  propagateChange = (_: any) => { };

  registerOnTouched(fn: any): void { }


  @HostListener('keydown', ['$event'])
  onKeydown($event) {
    const el = ($event.target as HTMLInputElement);
    this.cursorPosition = el.selectionStart;

    if (this.onDeleteOrBackSpacePressed($event)) {
      console.log(this.elementValue.charAt(this.cursorPosition));
      this.isUserDeletingValue = (this.elementValue) ? true : false;
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

  resetInputOnGreaterInput(inputValueSplited, maskSplited) {
    return inputValueSplited.map((actualGroup, index, arr) => {
      return this.exchangeValuesForwardToBack(inputValueSplited, maskSplited, actualGroup, index, arr);
    });
  }

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


  balanceInputByGreaterSizeValues(inputValueSplited, maskSplited) {

    return inputValueSplited.map((v, i, arr) => {
      console.log(v);

      if (maskSplited[i] && arr[i].length > maskSplited[i].length) {
        arr[i + 1] = v.substr(maskSplited[i].length) + arr[i + 1];
        v = v.substr(0, maskSplited[i].length);
      }

      return v;
    });
  }

  balanceInputBySmallersSizeValues(inputValueSplited, maskSplited) {

    return inputValueSplited.map((v, i, arr) => {
      while (arr[i + 1] && (arr[i].length < arr[i + 1].length || arr[i].length < maskSplited[i].length)) {
        v += arr[i + 1].charAt(0);
        arr[i + 1] = arr[i + 1].substr(1, arr[i + 1].length);
      }
      return v;
    });
  }


  isNumeric(value) {
    return /\d/.test(value);
  }

  inputedKeyValueIsNotNumeric(el) {
    return !this.isUserDeletingValue && !this.isNumeric(el.value.charAt(this.cursorPosition - 1));
  }

  isDeletingMaskSymbol() {
    return this.isUserDeletingValue && !this.isNumeric(this.elementValue.charAt(this.cursorPosition));
  }

  @HostListener('input', ['$event'])
  onInput($event) {

    const el: HTMLInputElement = ($event.target as HTMLInputElement);
    let inputValueSplitedValue;
    const [mask, maskReplacedPattern, maskSplited] = this.setStringMaskValues(this.appMask);
    const [inputValue, inputValueReplacedPattern, inputValueSplited] = this.setStringMaskValues($event.target.value);

    this.cursorPosition = el.selectionStart;


    if (this.onArrowsPressed($event)) {
      return;
    }

    if (this.inputedKeyValueIsNotNumeric(el) || this.isDeletingMaskSymbol()) {
      el.value = (this.elementValue) ? this.elementValue : '';
      el.selectionStart = el.selectionEnd = this.cursorPosition;
      return;
    }

    if (this.isUserDeletingValue) {
      inputValueSplitedValue = this.resetInputOnDeleting(inputValueSplited, maskSplited);
    } else {

      if (inputValueSplited.some((group, index) => group.length > maskSplited[index].length)) {
        inputValueSplitedValue = this.balanceInputByGreaterSizeValues(inputValueSplited, maskSplited);
      } else {
        inputValueSplitedValue = this.balanceInputBySmallersSizeValues(inputValueSplited, maskSplited);
      }
    }

    el.value = this.apllyInputMaskValue(inputValueSplitedValue, maskSplited, mask);
    this.elementValue = el.value;

    if (this.isUserDeletingValue) {
      this.isUserDeletingValue = false;
    }

    if (this.isNumeric(el.value.charAt(this.cursorPosition))) {
      el.selectionStart = el.selectionEnd = this.cursorPosition;
    } else {
      el.selectionStart = el.selectionEnd = this.cursorPosition + 1;
    }
  }

}
