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


  notIputableKeysPressedReturn($event, inputValue) {
    if ($event.keyCode === 8 || $event.keyCode === 37 || $event.keyCode === 38 || $event.keyCode === 39 || $event.keyCode === 40 || $event.keyCode === 46) {
      this.registerOnChange(inputValue);
      return true;
    }
  }


  @HostListener('keyup', ['$event'])
  onInput($event) {



    //criar um a função para rettorna as tres vesrões
    const mask: string = this.appMask;
    const maskReplacedPattern = mask.replace(/\D/g, '_');
    const maskSplited = mask.split(/\D/g);

    //criar um a função para rettorna as tres vesrões
    const inputValue: string = $event.target.value;
    const inputValueReplacedPattern = inputValue.replace(/\D/g, '_');
    const inputValueSplited = inputValue.split(/\D/g);

    console.log('mask: ', mask);
    console.log('maskSplited: ', maskSplited);
    console.log('maskReplacedPattern: ', maskReplacedPattern);


    console.log('inputValue: ', inputValue);
    console.log('inputValueSplited: ', inputValueSplited);
    console.log('inputValueReplacedPattern: ', inputValueReplacedPattern);

    /* retuonos */
    if (this.notIputableKeysPressedReturn($event, inputValue)) {
      return;
    }

    if (inputValueReplacedPattern.length > maskReplacedPattern.length) {
      console.log('remover último');
      $event.target.value = $event.target.value.substr(0, $event.target.value.length - 1);
      this.registerOnChange(inputValue);
      return;
    }

    console.log('init');

    let indexOnMask = 0;
    const inputJoined = inputValueSplited.map((value, index) => {

      indexOnMask += value.length;
      console.log('loop: ', value);

      if (value.length === maskSplited[index].length && parseFloat(value) <= parseFloat(maskSplited[index])) {
        console.log('index: ', indexOnMask);
        value += mask.charAt(indexOnMask);
        indexOnMask++;
      } else if (parseFloat(value) > parseFloat(maskSplited[index])) {
        const lastIndex = value.length - 1;
        const lastValue = value.charAt(lastIndex);
        value = value.substr(0, value.length - 1);

        indexOnMask--;
        value += mask.charAt(indexOnMask);
        value += lastValue;

        console.log('index: ', indexOnMask);

      }

      return value;
    }).join('');


    console.log('FINAL M: ', inputJoined);


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
